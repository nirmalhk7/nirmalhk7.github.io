import React from 'react';
import {act, render} from '@testing-library/react';
import {useAnalytics} from '@/hooks/useAnalytics';
const handlers = new Map<string, Set<(...args:unknown[])=>void>>();
let mockRouter={pathname:'/',asPath:'/',events:{on:(name:string,callback:(...args:unknown[])=>void)=>{ if (!handlers.has(name)) handlers.set(name,new Set()); handlers.get(name)?.add(callback); },off:(name:string,callback:(...args:unknown[])=>void)=>handlers.get(name)?.delete(callback)}};
jest.mock('next/router',()=>({useRouter:()=>mockRouter}));
const Probe=()=>{useAnalytics();return null;};
const emit=(name:string,...args:unknown[])=>handlers.get(name)?.forEach(callback=>callback(...args));

test('owns exactly one page view through Strict Mode, route, hash, shallow and failed transitions',()=>{
  jest.useFakeTimers(); const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  const {unmount,rerender}=render(<React.StrictMode><Probe /></React.StrictMode>);
  act(()=>jest.advanceTimersByTime(0));
  expect(spy.mock.calls.filter(call=>call[0]==='[Analytics] page_view')).toHaveLength(1);
  mockRouter={...mockRouter};
  rerender(<React.StrictMode><Probe /></React.StrictMode>);
  act(()=>jest.advanceTimersByTime(0));
  expect(spy.mock.calls.filter(call=>call[0]==='[Analytics] page_view')).toHaveLength(1);
  act(()=>{emit('hashChangeComplete','/#contact');emit('routeChangeComplete','/projects?id=atskit',{shallow:true});jest.advanceTimersByTime(0);});
  expect(spy.mock.calls.filter(call=>call[0]==='[Analytics] page_view')).toHaveLength(1);
  act(()=>{emit('routeChangeComplete','/blog');jest.advanceTimersByTime(0);});
  expect(spy.mock.calls.filter(call=>call[0]==='[Analytics] page_view')).toHaveLength(2);
  act(()=>emit('routeChangeError',{cancelled:false}));
  expect(spy).toHaveBeenCalledWith('[Analytics] exception',expect.objectContaining({error_category:'navigation'}));
  unmount(); expect(jest.getTimerCount()).toBe(0); expect([...handlers.values()].every(set=>set.size===0)).toBe(true);
  spy.mockRestore();jest.useRealTimers();
});

test('waits for animated page replacement before capturing the next page title',()=>{
  jest.useFakeTimers();const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  const marker=document.createElement('div');marker.setAttribute('data-analytics-page','/');document.body.appendChild(marker);
  mockRouter={...mockRouter,asPath:'/',pathname:'/'};
  const {unmount}=render(<Probe />);act(()=>jest.advanceTimersByTime(0));
  document.title='Home';act(()=>emit('routeChangeComplete','/blog'));
  act(()=>jest.advanceTimersByTime(16));
  expect(spy.mock.calls.filter(call=>call[0]==='[Analytics] page_view')).toHaveLength(1);
  marker.setAttribute('data-analytics-page','/blog');document.title='Writing';
  act(()=>jest.advanceTimersByTime(32));
  expect(spy).toHaveBeenCalledWith('[Analytics] page_view',expect.objectContaining({page_path:'/blog',page_title:'Writing'}));
  unmount();marker.remove();spy.mockRestore();jest.useRealTimers();
});
