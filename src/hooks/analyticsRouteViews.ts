import { trackEvent, trackPageView } from '@/util/analytics';
import { startPageTracking } from '@/util/analyticsRuntime';

export const isPrerendering = () => (document as Document & { prerendering?: boolean }).prerendering;

function routeIsMounted(url: string) {
  const expected = url.split('?')[0].split('#')[0];
  const pages = Array.from(document.querySelectorAll('[data-analytics-page]'));
  return !pages.length || pages.some(page => page.getAttribute('data-analytics-page') === expected);
}

export function scheduleRouteViews(onVisit: (url: string) => string) {
  let timer: number | undefined;
  let stop: (() => void) | undefined;
  const clear = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    stop?.();
    stop = undefined;
  };
  const schedule = (url: string) => {
    clear();
    let attempts = 0;
    const settled = () => {
      if (!routeIsMounted(url) && attempts++ < 125) {
        timer = window.setTimeout(settled, 16);
        return;
      }
      if (!isPrerendering()) stop = startPageTracking(onVisit(url));
    };
    timer = window.setTimeout(settled, 0);
  };
  return { clear, schedule };
}

const errorPages = new Map([['/404', 'not_found'], ['/500', 'server']]);

export function reportRouteView(pathname: string, current: string, previous: string) {
  const previousContext = previous ? {
    page_referrer: new URL(previous, window.location.origin).href,
    previous_page_path: previous,
  } : {};
  const error = errorPages.get(pathname);
  trackPageView(current, { view_type: 'route', ...previousContext, ...(error ? { page_type: pathname.slice(1) } : {}) });
  return () => { if (error) trackEvent('error_page', { error_category: error }); };
}
