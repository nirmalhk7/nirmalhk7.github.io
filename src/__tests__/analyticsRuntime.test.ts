import { startPageTracking } from '@/util/analyticsRuntime';
const disposers: (()=>void)[] = [];
const start = (page='/') => { const dispose=startPageTracking(page); disposers.push(dispose); return dispose; };
let spy: jest.SpyInstance;
const events = (name: string) => spy.mock.calls.filter(call => call[0] === `[Analytics] ${name}`).map(call=>call[1]);
const required = <T>(value: T | null) => { if (value === null) throw new Error('Missing test fixture'); return value; };
beforeEach(() => { jest.useFakeTimers(); spy=jest.spyOn(console,'log').mockImplementation(()=>{}); Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'}); document.body.innerHTML=''; });
afterEach(() => { disposers.splice(0).forEach(dispose=>dispose()); jest.useRealTimers(); spy.mockRestore(); });

test('records middle-click on owned links once, ignoring right-click and unsafe protocols', () => {
  document.body.innerHTML='<a data-analytics-skip-global="true" href="/resume">Resume</a><a href="javascript:void(0)">No</a>';
  const stop=start(); const links=document.querySelectorAll('a');
  links[0].dispatchEvent(new MouseEvent('auxclick',{bubbles:true,button:1}));
  links[0].dispatchEvent(new MouseEvent('auxclick',{bubbles:true,button:2}));
  links[1].dispatchEvent(new MouseEvent('auxclick',{bubbles:true,button:1}));
  expect(events('link_click')).toHaveLength(1);
  expect(events('link_click')[0]).toMatchObject({action_method:'middle_click',link_url:'http://localhost/resume'});
  stop();
});

test('identifies anchor target and containing public content without copying link text', () => {
  document.body.innerHTML='<main><article data-analytics-exposure="relaunch"><a href="#details">private@example.com</a><h2 id="details">Details</h2></article></main>';
  const stop=start();document.querySelector('a')?.click();
  expect(events('link_click')[0]).toMatchObject({target_id:'details',content_id:'relaunch'});
  expect(JSON.stringify(spy.mock.calls)).not.toContain('private@example.com');stop();
});

test('measures qualified content time, reading progress, hidden checkpoint and no hidden time', () => {
  document.body.innerHTML='<main><article data-analytics-exposure="relaunch" data-analytics-reading="true"></article></main>';
  const article=required(document.querySelector('article'));
  jest.spyOn(article,'getBoundingClientRect').mockReturnValue({top:0,bottom:2000,height:2000,left:0,right:1024,width:1024} as DOMRect);
  const stop=start();jest.advanceTimersByTime(2000);
  expect(events('content_progress').map(event=>event.depth_percentage)).toEqual([25]);
  Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});
  document.dispatchEvent(new Event('visibilitychange'));
  const checkpoint=events('content_summary')[0];
  expect(checkpoint).toMatchObject({content_id:'relaunch',interaction_type:'hidden',active_time_msec:2000});
  jest.advanceTimersByTime(30000);stop();
  expect(events('content_summary')).toHaveLength(1);
});

test('records sustained control hover/focus once per method without recording input contents', () => {
  document.body.innerHTML='<button data-analytics-id="search">Search</button><input value="private@example.com" />';
  const stop=start();const button=required(document.querySelector('button'));
  button.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));jest.advanceTimersByTime(1100);
  button.dispatchEvent(new MouseEvent('mouseout',{bubbles:true}));
  button.dispatchEvent(new FocusEvent('focusin',{bubbles:true}));jest.advanceTimersByTime(1100);
  document.querySelector('input')?.dispatchEvent(new FocusEvent('focusin',{bubbles:true}));jest.advanceTimersByTime(1100);
  expect(events('control_engagement').map(event=>event.action_method)).toEqual(['hover','focus']);
  expect(JSON.stringify(spy.mock.calls)).not.toContain('private@example.com');stop();
});

test('debounces viewport changes and records connectivity without connection identifiers', () => {
  const stop=start();window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('resize'));
  jest.advanceTimersByTime(600);
  expect(events('viewport_change')).toHaveLength(1);
  window.dispatchEvent(new Event('offline'));window.dispatchEvent(new Event('online'));
  expect(events('connection_change').map(event=>event.action)).toEqual(['offline','online']);
  stop();expect(jest.getTimerCount()).toBe(0);
});

test('records selection length in public content, excluding forms and selected text', () => {
  document.body.innerHTML='<article data-analytics-exposure="relaunch"><p>Private prose</p></article><form><textarea>private@example.com</textarea></form>';
  const stop=start();const range=document.createRange();range.selectNodeContents(required(document.querySelector('p')));
  const selection=required(document.getSelection());selection.removeAllRanges();selection.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));jest.advanceTimersByTime(600);
  expect(events('content_selection')[0]).toMatchObject({content_id:'relaunch',selection_length:13});
  range.selectNodeContents(required(document.querySelector('textarea')));selection.removeAllRanges();selection.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));jest.advanceTimersByTime(600);
  expect(events('content_selection')).toHaveLength(1);
  expect(JSON.stringify(spy.mock.calls)).not.toContain('Private prose');selection.removeAllRanges();stop();
});

test('uses authored disclosure identity for sustained summary focus',()=>{
  document.body.innerHTML='<details data-analytics-id="project_technology_filters"><summary>Technology</summary></details>';
  const stop=start();document.querySelector('summary')?.dispatchEvent(new FocusEvent('focusin',{bubbles:true}));
  jest.advanceTimersByTime(1100);
  expect(events('control_engagement')[0]).toMatchObject({button_id:'project_technology_filters',action_method:'focus'});stop();
});

test('does not double-count an unnamed article inside an explicitly identified project card',()=>{
  document.body.innerHTML='<main><div data-analytics-exposure="atskit"><article></article></div></main>';
  document.querySelectorAll('div,article').forEach(element=>jest.spyOn(element,'getBoundingClientRect').mockReturnValue({top:0,bottom:300,height:300,left:0,right:1024,width:1024} as DOMRect));
  const stop=start();jest.advanceTimersByTime(1500);stop();
  expect(events('content_summary')).toHaveLength(1);
  expect(events('content_summary')[0]).toMatchObject({content_id:'atskit'});
});

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

test('attributes keyboard copying from body to the selected article',()=>{
  document.body.innerHTML='<main><article data-analytics-exposure="relaunch"><p>Private prose</p></article></main>';
  const stop=start();const range=document.createRange();range.selectNodeContents(required(document.querySelector('p')));
  const selection=required(document.getSelection());selection.removeAllRanges();selection.addRange(range);
  document.body.dispatchEvent(new Event('copy',{bubbles:true}));
  expect(events('content_copy')[0]).toMatchObject({content_id:'relaunch'});
  expect(JSON.stringify(spy.mock.calls)).not.toContain('Private prose');selection.removeAllRanges();stop();
});

test('categorizes runtime, resource and rejected-promise errors without their messages',()=>{
  document.body.innerHTML='<img src="/favicon.ico" alt="" />';const stop=start();
  window.dispatchEvent(new ErrorEvent('error',{message:'private@example.com'}));
  document.querySelector('img')?.dispatchEvent(new Event('error'));
  const rejection=new Event('unhandledrejection');Object.defineProperty(rejection,'reason',{value:new Error('private@example.com')});window.dispatchEvent(rejection);
  expect(events('exception').map(event=>event.error_category)).toEqual(['runtime','resource','unhandled_rejection']);
  expect(JSON.stringify(spy.mock.calls)).not.toContain('private@example.com');stop();
});
