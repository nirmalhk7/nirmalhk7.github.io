import { trackEvent } from './analytics';
import { analyticsContentId, analyticsPlacement } from './analyticsDom';
import { type AnalyticsPayload, sanitizeAnalyticsUrl } from './analyticsPrivacy';

type EngagementScheduler = {
  listen: (target: EventTarget, name: string, handler: EventListener) => void;
  cancel: (name: string) => void;
  later: (name: string, delay: number, callback: () => void) => void;
};

const engagementEvents = [['mouseover', 'mouseout', 'hover'], ['focusin', 'focusout', 'focus']];

function findControl(event: Event) {
  if (!(event.target instanceof Element)) return null;
  const control = event.target.closest('a,button,[role="button"],summary');
  return control && !movedWithin(control, event) ? control : null;
}

function movedWithin(control: Element, event: Event) {
  return event instanceof MouseEvent && event.relatedTarget instanceof Node && control.contains(event.relatedTarget);
}

function identifyControl(control: Element): AnalyticsPayload | undefined {
  if (control.closest('form,[data-analytics-exposure-ignore="true"], [contenteditable="true"]')) return;
  const id = control.getAttribute('data-analytics-id') || control.id ||
    (control.tagName === 'SUMMARY' ? control.parentElement?.getAttribute('data-analytics-id') : undefined);
  const link = control instanceof HTMLAnchorElement ? sanitizeAnalyticsUrl(control.href, true) : '';
  if (!id && !link) return;
  return {
    button_id: id || undefined, link_url: link || undefined,
    content_id: analyticsContentId(control), placement: analyticsPlacement(control),
  };
}

function scheduleEngagement(event: Event, method: string, context: AnalyticsPayload, scheduler: EngagementScheduler, seen: Set<string>) {
  const control = findControl(event);
  if (!control) return;
  const data = identifyControl(control);
  if (!data) return;
  const key = JSON.stringify([method, data]);
  scheduler.later(method, 1000, () => {
    if (!control.isConnected || seen.has(key)) return;
    seen.add(key);
    trackEvent('control_engagement', { ...context, ...data, action_method: method, milestone_seconds: 1 });
  });
}

export function trackControlEngagement(context: AnalyticsPayload, scheduler: EngagementScheduler) {
  const seen = new Set<string>();
  for (const [enter, leave, method] of engagementEvents) {
    scheduler.listen(document, enter, event => scheduleEngagement(event, method, context, scheduler, seen));
    scheduler.listen(document, leave, event => { if (findControl(event)) scheduler.cancel(method); });
  }
  return () => seen.clear();
}
