import { trackEvent, trackScrollDepth, trackPageView } from './analytics';
import { type AnalyticsPayload, sanitizeAnalyticsUrl } from './analyticsPrivacy';
import { startInteractionTracking } from './analyticsInteractions';
import { trackPageControls } from './analyticsPageControls';
import { createReadingTracker, recordMilestones, scrollMilestones } from './analyticsReading';

function currentScrollDepth() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  return height > 0 ? Math.min(100, Math.max(0, Math.round(window.scrollY / height * 100))) : 0;
}

function observeContentChanges(invalidate: () => void) {
  if (typeof MutationObserver === 'undefined') return undefined;
  const observer = new MutationObserver(invalidate);
  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

function trackRuntimeErrors(context: AnalyticsPayload) {
  const error = (event: Event) => {
    const error_category = event.target instanceof Element ? 'resource' : 'runtime';
    trackEvent('exception', { ...context, error_category, fatal: false });
  };
  const rejection = () => trackEvent('exception', { ...context, error_category: 'unhandled_rejection', fatal: false });
  window.addEventListener('error', error, true);
  window.addEventListener('unhandledrejection', rejection);
  return () => {
    window.removeEventListener('error', error, true);
    window.removeEventListener('unhandledrejection', rejection);
  };
}

/** Owns one page visit. Caller disposes on navigation; hidden time never advances. */
export function startPageTracking(pagePath: string): () => void {
  let active = 0;
  let previous = Date.now();
  let visible = document.visibilityState === 'visible';
  let maxScroll = 0;
  let summarized = false;
  let stopped = false;
  const reached = new Set<number>();
  const depths = new Set<number>();
  const context = { page_path: pagePath, page_location: sanitizeAnalyticsUrl(new URL(pagePath, window.location.origin).href), page_title: document.title };
  const reading = createReadingTracker(context);
  const stopInteractions = startInteractionTracking(context);
  const tickTime = () => {
    const now = Date.now();
    const elapsed = visible ? Math.max(0, now - previous) : 0;
    active += elapsed;
    previous = now;
    return elapsed;
  };
  const sample = () => {
    const elapsed = tickTime();
    if (!visible || stopped) return;
    recordMilestones(active / 1000, [10, 30, 60, 120, 300], reached, seconds => {
      trackEvent('engagement_milestone', { ...context, milestone_seconds: seconds });
    });
    const depth = currentScrollDepth();
    maxScroll = Math.max(maxScroll, depth);
    recordMilestones(depth, scrollMilestones, depths, percent => trackScrollDepth(percent, context));
    reading.sample(elapsed);
  };
  const summary = () => {
    if (!stopped) sample();
    else tickTime();
    reading.flush('exit');
    if (summarized) return;
    summarized = true;
    trackEvent('page_summary', { ...context, active_time_msec: active, max_scroll_percentage: maxScroll });
  };
  const visibility = () => {
    sample();
    visible = document.visibilityState === 'visible';
    reading.clearVisibility();
    if (!visible) reading.flush('hidden');
    trackEvent('visibility_change', { ...context, visibility_state: document.visibilityState, active_time_msec: active });
  };
  const pagehide = () => { summary(); visible = false; reading.clearVisibility(); };
  const pageshow = (event: PageTransitionEvent) => {
    visible = document.visibilityState === 'visible';
    previous = Date.now();
    if (!event.persisted) return;
    active = 0;
    maxScroll = 0;
    summarized = false;
    reached.clear();
    depths.clear();
    reading.reset();
    trackPageView(pagePath, { view_type: 'restore' });
  };
  const mutation = observeContentChanges(reading.invalidate);
  const timer = window.setInterval(sample, 250);
  const stopControls = trackPageControls(context);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pagehide', pagehide);
  window.addEventListener('pageshow', pageshow);
  const stopErrors = trackRuntimeErrors(context);
  return () => {
    if (stopped) return;
    summary();
    stopped = true;
    stopInteractions();
    window.clearInterval(timer);
    mutation?.disconnect();
    stopControls();
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('pagehide', pagehide);
    window.removeEventListener('pageshow', pageshow);
    stopErrors();
  };
}
