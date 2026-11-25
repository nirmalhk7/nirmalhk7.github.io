import { trackEvent } from './analytics';
import type { AnalyticsPayload } from './analyticsPrivacy';
import { trackControlEngagement } from './analyticsControlEngagement';

import { containingElement } from './analyticsDom';

const privateSelection = 'form,input,textarea,[contenteditable="true"],[data-analytics-skip-global="true"]';

function readContentSelection() {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed) return;
  const start = containingElement(selection.anchorNode);
  const end = containingElement(selection.focusNode);
  const content = start?.closest('[data-analytics-exposure]');
  if (!content || !end || !content.contains(end)) return;
  if (start?.closest(privateSelection) || end.closest(privateSelection)) return;
  return { content_id: content.getAttribute('data-analytics-exposure'), selection_length: selection.toString().length };
}

/** Delegated, bounded signals: no control text, field values, pointer coordinates or key streams. */
export function startInteractionTracking(context: AnalyticsPayload) {
  const cleanups: (() => void)[] = [];
  const timers = new Map<string, number>();
  const listen = (target: EventTarget, name: string, handler: EventListener) => {
    target.addEventListener(name, handler);
    cleanups.push(() => target.removeEventListener(name, handler));
  };
  const cancel = (key: string) => { window.clearTimeout(timers.get(key)); timers.delete(key); };
  const later = (key: string, delay: number, callback: () => void) => {
    cancel(key);
    timers.set(key, window.setTimeout(() => { timers.delete(key); if (document.visibilityState === 'visible') callback(); }, delay));
  };
  const resetEngagement = trackControlEngagement(context, { listen, cancel, later });
  listen(window, 'resize', () => later('resize', 500, () => trackEvent('viewport_change', context)));
  for (const name of ['online','offline']) listen(window, name, () => trackEvent('connection_change', { ...context, action: name }));
  listen(document, 'selectionchange', () => later('selection', 500, () => {
    const selection = readContentSelection();
    if (selection) trackEvent('content_selection', { ...context, ...selection });
  }));
  const clear = () => { timers.forEach(timer => window.clearTimeout(timer)); timers.clear(); };
  listen(document, 'visibilitychange', () => { if (document.visibilityState !== 'visible') clear(); });
  listen(window, 'pagehide', clear);
  listen(window, 'pageshow', event => { if ((event as PageTransitionEvent).persisted) resetEngagement(); });
  return () => { clear(); cleanups.forEach(cleanup => cleanup()); };
}
