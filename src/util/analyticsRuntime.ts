import { trackEvent, trackFileDownload, trackScrollDepth, trackPageView } from './analytics';
import { sanitizeAnalyticsUrl } from './analyticsPrivacy';

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
  const exposures = new Set<string>();
  const qualifying = new Map<Element, number>();
  let dirty = true;
  let elements: Element[] = [];
  const context = {page_path:pagePath,page_location:sanitizeAnalyticsUrl(new URL(pagePath,window.location.origin).href),page_title:document.title};
  const tickTime = () => { const now=Date.now(); if (visible) active += Math.max(0,now-previous); previous=now; };
  const summary = () => { tickTime(); if (!summarized) { summarized=true; trackEvent('page_summary',{...context, active_time_msec:active, max_scroll_percentage:maxScroll}); } };
  const sample = () => {
    tickTime();
    if (!visible || stopped) return;
    for (const seconds of [10,30,60,120,300]) if (active >= seconds*1000 && !reached.has(seconds)) { reached.add(seconds); trackEvent('engagement_milestone',{...context,milestone_seconds:seconds}); }
    const height = document.documentElement.scrollHeight-window.innerHeight;
    const depth = height > 0 ? Math.min(100,Math.max(0,Math.round(window.scrollY/height*100))) : 0;
    maxScroll=Math.max(maxScroll,depth);
    for (const percent of [25,50,75,90,100]) if (depth >= percent && !depths.has(percent)) { depths.add(percent); trackScrollDepth(percent,context); }
    if (dirty) { elements=Array.from(document.querySelectorAll('main section, section[id], [data-analytics-exposure], main article')).filter(element=>!element.closest('[data-analytics-exposure-ignore="true"]')); dirty=false; }
    for (const element of elements) {
      const rect=element.getBoundingClientRect();
      const heightVisible=Math.max(0,Math.min(rect.bottom,window.innerHeight)-Math.max(rect.top,0));
      const widthVisible=Math.max(0,Math.min(rect.right,window.innerWidth)-Math.max(rect.left,0));
      const qualifies=rect.height>0 && rect.width>0 && heightVisible>=Math.min(rect.height,window.innerHeight)*.5 && widthVisible>=Math.min(rect.width,window.innerWidth)*.5;
      const id=element.getAttribute('data-analytics-exposure') || element.id || element.getAttribute('aria-labelledby') || `${element.tagName.toLowerCase()}_${elements.indexOf(element)}`;
      if (!qualifies) { qualifying.delete(element); continue; }
      if (!qualifying.has(element)) qualifying.set(element,Date.now());
      if (!exposures.has(id) && Date.now()-(qualifying.get(element) ?? Date.now())>=1000) {
        exposures.add(id); trackEvent(element.tagName==='SECTION'?'section_view':'content_view',{...context,section_id:element.tagName==='SECTION'?id:undefined,content_id:element.tagName!=='SECTION'?id:undefined});
      }
    }
  };
  const visibility = () => { tickTime(); visible=document.visibilityState==='visible'; qualifying.clear(); trackEvent('visibility_change',{...context,visibility_state:document.visibilityState,active_time_msec:active}); };
  const pagehide = () => { summary(); visible=false; qualifying.clear(); };
  const pageshow = (event: PageTransitionEvent) => {
    visible=document.visibilityState==='visible'; previous=Date.now();
    if (event.persisted) { active=0; maxScroll=0; summarized=false; reached.clear(); depths.clear(); exposures.clear(); qualifying.clear(); dirty=true; trackPageView(pagePath,{view_type:'restore'}); }
  };
  const click = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const control=event.target.closest('a,button,[role="button"]');
    if (!control || control.closest('[data-analytics-skip-global="true"]')) return;
    const method=event.detail===0?'keyboard':'pointer';
    const placement=control.closest('nav')?'navigation':control.closest('footer')?'footer':'content';
    if (control instanceof HTMLAnchorElement) {
      const url=new URL(control.href,window.location.origin);
      const type=url.protocol==='mailto:'?'email':url.protocol==='tel:'?'phone':url.hash && url.origin===window.location.origin?'anchor':'navigation';
      if (!['http:','https:','mailto:','tel:'].includes(url.protocol)) return;
      trackEvent('link_click',{...context,interaction_type:type,link_url:sanitizeAnalyticsUrl(control.href,true),link_domain:url.protocol.startsWith('http')?url.hostname:undefined,link_id:control.id||undefined,outbound:url.origin!==window.location.origin && type==='navigation',action_method:method,placement});
      if (/\.(pdf|zip|txt|csv|docx?|xlsx?|pptx?)$/i.test(url.pathname)) trackFileDownload(url.pathname.split('/').pop() || 'download',control.href,{...context,interaction_type:'download_initiated',placement});
    } else trackEvent('button_click',{...context,button_id:control.getAttribute('data-analytics-id')||control.id||'unlabeled',button_type:control.getAttribute('type')||undefined,action_method:method,placement});
  };
  const disclosureStates = new WeakMap<HTMLDetailsElement,boolean>();
  document.querySelectorAll('details').forEach(element=>disclosureStates.set(element,element.open));
  const disclosure = (event: Event) => {
    if (!(event.target instanceof HTMLDetailsElement) || event.target.closest('[data-analytics-skip-global="true"]')) return;
    const element=event.target;
    if (disclosureStates.get(element)===element.open) return;
    disclosureStates.set(element,element.open);
    trackEvent('disclosure_toggle',{...context,button_id:element.getAttribute('data-analytics-id')||element.id||'disclosure',action:element.open?'open':'close'});
  };
  const copy = (event: Event) => {
    const selected=document.getSelection()?.anchorNode;
    const target=event.target instanceof Element ? event.target : selected instanceof Element ? selected : selected?.parentElement;
    if (target?.closest('form,[data-analytics-skip-global="true"]')) return;
    trackEvent('content_copy',{...context,content_id:target?.closest('[data-analytics-exposure]')?.getAttribute('data-analytics-exposure')||undefined,action:'copy_requested'});
  };
  const print = () => trackEvent('print_intent',{...context,action:'print_requested'});
  const error = (event: Event) => {
    const resource=event.target instanceof Element;
    trackEvent('exception',{...context,error_category:resource?'resource':'runtime',fatal:false});
  };
  const rejection = () => trackEvent('exception',{...context,error_category:'unhandled_rejection',fatal:false});
  const mutation = typeof MutationObserver !== 'undefined' ? new MutationObserver(()=>{dirty=true;}) : undefined;
  mutation?.observe(document.body,{childList:true,subtree:true});
  const timer=window.setInterval(sample,250);
  document.addEventListener('toggle',disclosure,true);
  document.addEventListener('copy',copy);
  window.addEventListener('beforeprint',print);
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',pagehide);
  window.addEventListener('pageshow',pageshow);
  window.addEventListener('click',click);
  window.addEventListener('error',error,true);
  window.addEventListener('unhandledrejection',rejection);
  return () => { stopped=true; summary(); window.clearInterval(timer); mutation?.disconnect(); document.removeEventListener('toggle',disclosure,true); document.removeEventListener('copy',copy); window.removeEventListener('beforeprint',print); document.removeEventListener('visibilitychange',visibility); window.removeEventListener('pagehide',pagehide); window.removeEventListener('pageshow',pageshow); window.removeEventListener('click',click); window.removeEventListener('error',error,true); window.removeEventListener('unhandledrejection',rejection); };
}
