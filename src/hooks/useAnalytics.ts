import { useEffect, useRef } from 'react';
import { useRouter, type NextRouter } from 'next/router';
import { trackEvent } from '@/util/analytics';
import { isPrerendering, reportRouteView, scheduleRouteViews } from './analyticsRouteViews';

type RouteOptions = { shallow?: boolean };
type Navigation = { url: string; since: number };

function matchesNavigation(navigation: Navigation | undefined, url?: string): navigation is Navigation {
  return Boolean(navigation && (!url || navigation.url === url));
}

function trackRoutes(events: NextRouter['events'], getRouter: () => NextRouter) {
  let current = '';
  let pending: Navigation | undefined;
  const timing = (action: string, previous: string, navigation: Navigation, destination = navigation.url) => {
    trackEvent('navigation_timing', {
      action, destination_page_path: destination, previous_page_path: previous,
      duration_msec: Date.now() - navigation.since,
    });
    pending = undefined;
  };
  const views = scheduleRouteViews(url => {
    const previous = current;
    current = url.split('#')[0];
    const reportError = reportRouteView(getRouter().pathname, current, previous);
    if (pending?.url === url) timing('complete', previous, pending, current);
    reportError();
    return current;
  });
  const begin = (url: string, options?: RouteOptions) => {
    if (!options?.shallow) pending = { url, since: Date.now() };
  };
  const visit = (url: string, options?: RouteOptions) => {
    const samePage = current && current.split('?')[0] === url.split('?')[0];
    if (options?.shallow || samePage) {
      trackEvent('page_navigation', { interaction_type: 'state_change', destination_page_path: url });
    } else views.schedule(url);
  };
  const hash = (url: string) => trackEvent('page_navigation', { interaction_type: 'anchor', destination_page_path: url });
  const error = (failure: { cancelled?: boolean }, url?: string) => {
    if (matchesNavigation(pending, url)) timing(failure.cancelled ? 'cancelled' : 'error', current, pending);
    if (!failure.cancelled) trackEvent('exception', { error_category: 'navigation', fatal: false });
  };
  const activate = () => visit(getRouter().asPath);
  if (!isPrerendering()) activate();
  document.addEventListener('prerenderingchange', activate);
  events.on('routeChangeComplete', visit);
  events.on('routeChangeStart', begin);
  events.on('hashChangeComplete', hash);
  events.on('routeChangeError', error);
  return () => {
    views.clear();
    document.removeEventListener('prerenderingchange', activate);
    events.off('routeChangeComplete', visit);
    events.off('routeChangeStart', begin);
    events.off('hashChangeComplete', hash);
    events.off('routeChangeError', error);
  };
}

export const useAnalytics = () => {
  const router = useRouter();
  const latest = useRef(router);
  latest.current = router;
  const { events, isReady } = router;
  useEffect(() => {
    if (isReady !== false) return trackRoutes(events, () => latest.current);
  }, [events, isReady]);
};
