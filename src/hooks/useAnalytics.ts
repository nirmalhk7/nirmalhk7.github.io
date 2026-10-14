import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { trackEvent, trackPageView } from '@/util/analytics';
import { startPageTracking } from '@/util/analyticsRuntime';

export const useAnalytics = () => {
  const router = useRouter();
  const latest=useRef(router);
  latest.current=router;
  const events=router.events;
  const ready=router.isReady;
  useEffect(() => {
    if (ready===false) return;
    let timer: number | undefined;
    let stop: (()=>void) | undefined;
    let current = '';
    const visit = (url: string, options?: {shallow?:boolean}) => {
      if (options?.shallow || (current && current.split('?')[0]===url.split('?')[0])) {
        trackEvent('page_navigation',{interaction_type:'state_change',destination_page_path:url}); return;
      }
      if (timer !== undefined) window.clearTimeout(timer);
      stop?.(); stop=undefined;
      let attempts=0;
      const settled = () => {
        const expectedPath=url.split('?')[0].split('#')[0];
        const pages=Array.from(document.querySelectorAll('[data-analytics-page]'));
        if (pages.length && !pages.some(page=>page.getAttribute('data-analytics-page')===expectedPath) && attempts++ < 125) { timer=window.setTimeout(settled,16); return; }
        if ((document as Document & {prerendering?:boolean}).prerendering) return;
        current=url.split('#')[0];
        trackPageView(current,{view_type:'route',...(latest.current.pathname==='/404'||latest.current.pathname==='/500'?{page_type:latest.current.pathname.slice(1)}:{})});
        if (latest.current.pathname==='/404' || latest.current.pathname==='/500') trackEvent('error_page',{error_category:latest.current.pathname==='/404'?'not_found':'server'});
        stop=startPageTracking(current);
      };
      timer=window.setTimeout(settled,0);
    };
    const hash = (url: string) => trackEvent('page_navigation',{interaction_type:'anchor',destination_page_path:url});
    const error = (failure: {cancelled?:boolean}) => { if (!failure.cancelled) trackEvent('exception',{error_category:'navigation',fatal:false}); };
    const activate = () => visit(latest.current.asPath);
    if (!(document as Document & {prerendering?:boolean}).prerendering) activate();
    document.addEventListener('prerenderingchange',activate);
    events.on('routeChangeComplete',visit);
    events.on('hashChangeComplete',hash);
    events.on('routeChangeError',error);
    return () => { if (timer !== undefined) window.clearTimeout(timer); stop?.(); document.removeEventListener('prerenderingchange',activate); events.off('routeChangeComplete',visit); events.off('hashChangeComplete',hash); events.off('routeChangeError',error); };
  }, [events,ready]);
};
