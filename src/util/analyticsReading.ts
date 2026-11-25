import { trackEvent } from './analytics';
import type { AnalyticsPayload } from './analyticsPrivacy';

export const scrollMilestones = [25, 50, 75, 90, 100];

export function recordMilestones(value: number, thresholds: number[], seen: Set<number>, record: (threshold: number) => void) {
  for (const threshold of thresholds) {
    if (value >= threshold && !seen.has(threshold)) {
      seen.add(threshold);
      record(threshold);
    }
  }
}

type ContentVisit = { id: string; section: boolean; active: number; max: number; depths: Set<number> };

function includeElement(element: Element) {
  if (element.closest('[data-analytics-exposure-ignore="true"]')) return false;
  return element.tagName !== 'ARTICLE' || element.hasAttribute('data-analytics-exposure') ||
    !element.parentElement?.closest('[data-analytics-exposure]');
}

function isVisible(rect: DOMRect) {
  if (rect.height <= 0 || rect.width <= 0) return false;
  const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  return height >= Math.min(rect.height, window.innerHeight) * 0.5 &&
    width >= Math.min(rect.width, window.innerWidth) * 0.5;
}

function contentId(element: Element, index: number) {
  return element.getAttribute('data-analytics-exposure') || element.id ||
    element.getAttribute('aria-labelledby') || `${element.tagName.toLowerCase()}_${index}`;
}

function recordReading(visit: ContentVisit, rect: DOMRect, context: AnalyticsPayload) {
  const progress = Math.min(100, Math.max(0, Math.round((window.innerHeight - rect.top) / rect.height * 100)));
  visit.max = Math.max(visit.max, progress);
  recordMilestones(progress, scrollMilestones, visit.depths, percent => {
    trackEvent('content_progress', { ...context, content_id: visit.id, depth_percentage: percent });
  });
}

interface ReadingState {
  exposures: Set<string>;
  qualifying: Map<Element, number>;
  content: Map<string, ContentVisit>;
}

function trackExposure(element: Element, { id, section }: ContentVisit, state: ReadingState, context: AnalyticsPayload) {
  const { qualifying, exposures } = state;
  if (!qualifying.has(element)) qualifying.set(element, Date.now());
  if (exposures.has(id) || Date.now() - (qualifying.get(element) ?? Date.now()) < 1000) return;
  exposures.add(id);
  trackEvent(section ? 'section_view' : 'content_view', {
    ...context, section_id: section ? id : undefined, content_id: section ? undefined : id,
  });
}

function sampleElement(element: Element, index: number, elapsed: number, state: ReadingState, context: AnalyticsPayload) {
  const rect = element.getBoundingClientRect();
  if (!isVisible(rect)) {
    state.qualifying.delete(element);
    return;
  }
  const id = contentId(element, index);
  const section = element.tagName === 'SECTION';
  const key = `${section ? 'section' : 'content'}:${id}`;
  const visit = state.content.get(key) ?? { id, section, active: 0, max: 0, depths: new Set<number>() };
  state.content.set(key, visit);
  visit.active += elapsed;
  if (element.getAttribute('data-analytics-reading') === 'true') recordReading(visit, rect, context);
  trackExposure(element, visit, state, context);
}

export function createReadingTracker(context: AnalyticsPayload) {
  const state: ReadingState = { exposures: new Set(), qualifying: new Map(), content: new Map() };
  let elements: Element[] | undefined;


  return {
    sample(elapsed: number) {
      elements ??= Array.from(document.querySelectorAll('main section, section[id], [data-analytics-exposure], main article')).filter(includeElement);
      elements.forEach((element, index) => sampleElement(element, index, elapsed, state, context));
    },
    flush(reason: string) {
      state.content.forEach(item => {
        if (item.active <= 0) return;
        trackEvent('content_summary', {
          ...context, content_id: item.section ? undefined : item.id, section_id: item.section ? item.id : undefined,
          active_time_msec: item.active, max_scroll_percentage: item.max, interaction_type: reason,
        });
        item.active = 0;
      });
    },
    clearVisibility: () => state.qualifying.clear(),
    invalidate: () => { elements = undefined; },
    reset() {
      state.exposures.clear();
      state.qualifying.clear();
      state.content.clear();
      elements = undefined;
    },
  };
}
