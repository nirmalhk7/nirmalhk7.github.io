import { startPageTracking } from '@/util/analyticsRuntime';
const start = (page='/') => startPageTracking(page);
let spy: jest.SpyInstance;
const events = (name: string) => spy.mock.calls.filter(call => call[0] === `[Analytics] ${name}`).map(call=>call[1]);
beforeEach(() => { jest.useFakeTimers(); spy=jest.spyOn(console,'log').mockImplementation(()=>{}); Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'}); document.body.innerHTML=''; });
afterEach(() => { jest.useRealTimers(); spy.mockRestore(); });

test('counts visible time only and flushes lifecycle summary once', () => {
  const stop=start(); jest.advanceTimersByTime(10000);
  expect(events('engagement_milestone')).toHaveLength(1);
  Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});
  document.dispatchEvent(new Event('visibilitychange')); jest.advanceTimersByTime(30000);
  window.dispatchEvent(new Event('pagehide')); window.dispatchEvent(new Event('pagehide'));
  expect(events('page_summary')).toHaveLength(1);
  expect(events('page_summary')[0].active_time_msec).toBe(10000);
  expect(events('engagement_milestone')).toHaveLength(1);
  stop();
});

test('qualifies oversized section exposure for one second, deduplicates and cleans up', () => {
  document.body.innerHTML='<section id="about"></section>';
  const section=document.querySelector('section');
  if (!section) throw new Error('Missing section');
  jest.spyOn(section,'getBoundingClientRect').mockReturnValue({top:0,bottom:2000,height:2000,left:0,right:1024,width:1024} as DOMRect);
  const stop=start(); jest.advanceTimersByTime(1500);
  expect(events('section_view')).toHaveLength(1);
  jest.advanceTimersByTime(1500); expect(events('section_view')).toHaveLength(1);
  stop(); expect(jest.getTimerCount()).toBe(0);
});

test('never copies visitor text from controls and distinguishes email actions', () => {
  document.body.innerHTML='<button id="stable">visitor@example.com</button><a href="mailto:visitor@example.com">contact</a>';
  const stop=start(); (document.querySelector('button') as HTMLElement).click(); (document.querySelector('a') as HTMLElement).click();
  expect(events('button_click')[0]).toMatchObject({button_id:'stable'});
  expect(JSON.stringify(spy.mock.calls)).not.toContain('visitor@example.com');
  expect(events('link_click')[0]).toMatchObject({interaction_type:'email'});
  stop();
});

test('emits each scroll threshold once and restarts milestones on a new visit',()=>{
  Object.defineProperty(document.documentElement,'scrollHeight',{configurable:true,value:1768});
  Object.defineProperty(window,'scrollY',{configurable:true,value:1000});
  const stop=start(); jest.advanceTimersByTime(1000);
  expect(events('scroll_depth').map(event=>event.depth_percentage)).toEqual([25,50,75,90,100]);
  stop(); const stopNext=start('/projects'); jest.advanceTimersByTime(250);
  expect(events('scroll_depth')).toHaveLength(10); stopNext();
});

test('suppresses generic events for explicitly instrumented controls',()=>{
  document.body.innerHTML='<a data-analytics-skip-global="true" href="/resume">Resume</a>';
  const stop=start(); (document.querySelector('a') as HTMLElement).click();
  expect(events('link_click')).toHaveLength(0); stop();
});

test('restored BFCache visit emits a new page view and resets engagement milestones',()=>{
  const stop=start('/projects');jest.advanceTimersByTime(10000);
  window.dispatchEvent(new Event('pagehide'));
  window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));
  expect(events('page_view')).toHaveLength(1);
  expect(events('page_view')[0]).toMatchObject({page_path:'/projects',view_type:'restore'});
  jest.advanceTimersByTime(10000);expect(events('engagement_milestone')).toHaveLength(2);stop();
});

test('records disclosure state changes once without copying summary text',()=>{
  document.body.innerHTML='<main><details data-analytics-id="technology_filters"><summary>private@example.com</summary></details></main>';
  const stop=start();const details=document.querySelector('details');if (!details) throw new Error('Missing details');
  details.open=true;details.dispatchEvent(new Event('toggle'));details.dispatchEvent(new Event('toggle'));
  expect(events('disclosure_toggle')).toHaveLength(1);
  expect(events('disclosure_toggle')[0]).toMatchObject({button_id:'technology_filters',action:'open'});
  details.open=false;details.dispatchEvent(new Event('toggle'));
  expect(events('disclosure_toggle')).toHaveLength(2);stop();
});

test('records article copy intent and printing without collecting copied text',()=>{
  document.body.innerHTML='<main><article data-analytics-exposure="relaunch"><p>private@example.com</p></article></main>';
  const stop=start();document.querySelector('p')?.dispatchEvent(new Event('copy',{bubbles:true}));
  window.dispatchEvent(new Event('beforeprint'));
  expect(events('content_copy')[0]).toMatchObject({content_id:'relaunch',action:'copy_requested'});
  expect(events('print_intent')).toHaveLength(1);
  expect(JSON.stringify(spy.mock.calls)).not.toContain('private@example.com');stop();
});

test('categorizes runtime, resource and rejected-promise errors without their messages',()=>{
  document.body.innerHTML='<img alt="" />';const stop=start();
  window.dispatchEvent(new ErrorEvent('error',{message:'private@example.com'}));
  document.querySelector('img')?.dispatchEvent(new Event('error'));
  const rejection=new Event('unhandledrejection');Object.defineProperty(rejection,'reason',{value:new Error('private@example.com')});window.dispatchEvent(rejection);
  expect(events('exception').map(event=>event.error_category)).toEqual(['runtime','resource','unhandled_rejection']);
  expect(JSON.stringify(spy.mock.calls)).not.toContain('private@example.com');stop();
});
