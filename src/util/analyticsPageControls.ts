import { trackEvent, trackFileDownload } from './analytics';
import { analyticsContentId, analyticsPlacement, containingElement } from './analyticsDom';
import { type AnalyticsPayload, sanitizeAnalyticsUrl } from './analyticsPrivacy';

const ignoredControl = '[data-analytics-skip-global="true"]';
const documentProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const downloadablePath = /\.(pdf|zip|txt|csv|docx?|xlsx?|pptx?)$/i;

function linkType(url: URL) {
  if (url.protocol === 'mailto:') return 'email';
  if (url.protocol === 'tel:') return 'phone';
  return url.hash && url.origin === window.location.origin ? 'anchor' : 'navigation';
}

function anchorTarget(url: URL) {
  const isCurrentPage = url.origin === window.location.origin && url.pathname === window.location.pathname;
  if (!isCurrentPage) return undefined;
  try {
    const id = decodeURIComponent(url.hash.slice(1));
    return document.getElementById(id) ? id : undefined;
  } catch { return undefined; }
}

function trackLink(control: HTMLAnchorElement, context: AnalyticsPayload, action_method: string, placement: string) {
  const url = new URL(control.href, window.location.origin);
  if (!documentProtocols.has(url.protocol)) return;
  const type = linkType(url);
  trackEvent('link_click', {
    ...context, interaction_type: type, link_url: sanitizeAnalyticsUrl(control.href, true),
    link_domain: url.protocol.startsWith('http') ? url.hostname : undefined, link_id: control.id || undefined,
    target_id: anchorTarget(url), content_id: analyticsContentId(control),
    outbound: url.origin !== window.location.origin && type === 'navigation', action_method, placement,
  });
  if (downloadablePath.test(url.pathname)) {
    trackFileDownload(url.pathname.split('/').pop() || 'download', control.href, {
      ...context, interaction_type: 'download_initiated', placement,
    });
  }
}

function trackControl(event: MouseEvent, context: AnalyticsPayload) {
  if (!(event.target instanceof Element)) return;
  const control = event.target.closest('a,button,[role="button"]');
  if (!control) return;
  const middle = event.type === 'auxclick';
  if (middle && (event.button !== 1 || !(control instanceof HTMLAnchorElement))) return;
  if (!middle && control.closest(ignoredControl)) return;
  const action_method = middle ? 'middle_click' : event.detail === 0 ? 'keyboard' : 'pointer';
  const placement = analyticsPlacement(control);
  if (control instanceof HTMLAnchorElement) trackLink(control, context, action_method, placement);
  else trackEvent('button_click', {
    ...context, button_id: control.getAttribute('data-analytics-id') || control.id || 'unlabeled',
    button_type: control.getAttribute('type') || undefined, action_method, placement,
  });
}

function copyTarget(event: Event) {
  const element = event.target instanceof Element ? event.target : undefined;
  if (element && element !== document.body && element !== document.documentElement) return element;
  return containingElement(document.getSelection()?.anchorNode) || element;
}

export function trackPageControls(context: AnalyticsPayload) {
  const disclosureStates = new WeakMap<HTMLDetailsElement, boolean>();
  document.querySelectorAll('details').forEach(element => disclosureStates.set(element, element.open));
  const disclosure = (event: Event) => {
    const element = event.target;
    if (!(element instanceof HTMLDetailsElement) || element.closest(ignoredControl)) return;
    if (disclosureStates.get(element) === element.open) return;
    disclosureStates.set(element, element.open);
    trackEvent('disclosure_toggle', {
      ...context, button_id: element.getAttribute('data-analytics-id') || element.id || 'disclosure',
      action: element.open ? 'open' : 'close',
    });
  };
  const copy = (event: Event) => {
    const target = copyTarget(event);
    if (target?.closest(`form,${ignoredControl}`)) return;
    trackEvent('content_copy', { ...context, content_id: target ? analyticsContentId(target) : undefined, action: 'copy_requested' });
  };
  const click = (event: MouseEvent) => trackControl(event, context);
  const print = () => trackEvent('print_intent', { ...context, action: 'print_requested' });
  document.addEventListener('toggle', disclosure, true);
  document.addEventListener('copy', copy);
  window.addEventListener('beforeprint', print);
  window.addEventListener('click', click);
  window.addEventListener('auxclick', click);
  return () => {
    document.removeEventListener('toggle', disclosure, true);
    document.removeEventListener('copy', copy);
    window.removeEventListener('beforeprint', print);
    window.removeEventListener('click', click);
    window.removeEventListener('auxclick', click);
  };
}
