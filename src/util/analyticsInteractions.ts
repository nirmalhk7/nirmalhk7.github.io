import { trackEvent } from './analytics';
import { AnalyticsPayload, sanitizeAnalyticsUrl } from './analyticsPrivacy';

/** Delegated, bounded signals: no control text, field values, pointer coordinates or key streams. */
export function startInteractionTracking(context: AnalyticsPayload) {
  const cleanups: (() => void)[] = [];
  const timers = new Map<string, number>();
  const seen = new Set<string>();
  const listen = (target: EventTarget, name: string, handler: EventListener) => {
    target.addEventListener(name, handler);
    cleanups.push(() => target.removeEventListener(name, handler));
  };
  const cancel = (key: string) => { window.clearTimeout(timers.get(key)); timers.delete(key); };
  const later = (key: string, delay: number, callback: () => void) => {
    cancel(key);
    timers.set(key, window.setTimeout(() => { timers.delete(key); if (document.visibilityState === 'visible') callback(); }, delay));
  };
  const controlOf = (target: EventTarget | null) => target instanceof Element
    ? target.closest('a,button,[role="button"],summary') : null;
  const identity = (control: Element): AnalyticsPayload | undefined => {
    if (control.closest('form,[data-analytics-exposure-ignore="true"], [contenteditable="true"]')) return;
    const id = control.getAttribute('data-analytics-id') || control.id ||
      (control.tagName === 'SUMMARY' ? control.parentElement?.getAttribute('data-analytics-id') : undefined);
    const link = control instanceof HTMLAnchorElement ? sanitizeAnalyticsUrl(control.href, true) : '';
    if (!id && !link) return;
    return { button_id: id || undefined, link_url: link || undefined,
      content_id: control.closest('[data-analytics-exposure]')?.getAttribute('data-analytics-exposure') || undefined,
      placement: control.closest('nav') ? 'navigation' : control.closest('footer') ? 'footer' : 'content' };
  };
  for (const [enter, leave, method] of [['mouseover','mouseout','hover'],['focusin','focusout','focus']]) {
    listen(document, enter, event => {
      const control = controlOf(event.target);
      if (!control || (event instanceof MouseEvent && event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) return;
      const data = identity(control);
      if (!data) return;
      const key = JSON.stringify([method, data]);
      later(method, 1000, () => {
        if (!control.isConnected || seen.has(key)) return;
        seen.add(key); trackEvent('control_engagement', { ...context, ...data, action_method: method, milestone_seconds: 1 });
      });
    });
    listen(document, leave, event => {
      const control = controlOf(event.target);
      if (control && !(event instanceof MouseEvent && event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) cancel(method);
    });
  }
  listen(window, 'resize', () => later('resize', 500, () => trackEvent('viewport_change', context)));
  for (const name of ['online','offline']) listen(window, name, () => trackEvent('connection_change', { ...context, action: name }));
  listen(document, 'selectionchange', () => later('selection', 500, () => {
    const selection = document.getSelection();
    const anchor = selection?.anchorNode;
    const focus = selection?.focusNode;
    const start = anchor instanceof Element ? anchor : anchor?.parentElement;
    const end = focus instanceof Element ? focus : focus?.parentElement;
    const content = start?.closest('[data-analytics-exposure]');
    if (!selection || selection.isCollapsed || !content || !end || !content.contains(end) ||
      start?.closest('form,input,textarea,[contenteditable="true"],[data-analytics-skip-global="true"]') ||
      end.closest('form,input,textarea,[contenteditable="true"],[data-analytics-skip-global="true"]')) return;
    trackEvent('content_selection', { ...context, content_id: content.getAttribute('data-analytics-exposure'), selection_length: selection.toString().length });
  }));
  const clear = () => { timers.forEach(timer => window.clearTimeout(timer)); timers.clear(); };
  listen(document, 'visibilitychange', () => { if (document.visibilityState !== 'visible') clear(); });
  listen(window, 'pagehide', clear);
  listen(window, 'pageshow', event => { if ((event as PageTransitionEvent).persisted) seen.clear(); });
  return () => { clear(); cleanups.forEach(cleanup => cleanup()); };
}
