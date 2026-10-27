import React from 'react';
import {act,fireEvent,render,screen} from '@testing-library/react';
import {CommandPalette} from '@/components/UI/CommandPalette';
const mockPush = jest.fn();
jest.mock('next/router',()=>({useRouter:()=>({push:mockPush})}));

test('records palette keyboard journey and safe settled results',()=>{
  jest.useFakeTimers(); const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  render(<CommandPalette />);
  fireEvent.keyDown(window,{key:'k',ctrlKey:true});
  expect(spy).toHaveBeenCalledWith('[Analytics] command_palette',expect.objectContaining({action:'open',action_method:'keyboard'}));
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'Java'}});
  act(()=>jest.advanceTimersByTime(700));
  expect(spy).toHaveBeenCalledWith('[Analytics] site_search',expect.objectContaining({search_scope:'command_palette',query_length:4,matched_ids:'skill-java',result_count:1}));
  fireEvent.keyDown(screen.getByRole('combobox'),{key:'Enter'});
  expect(spy).toHaveBeenCalledWith('[Analytics] select_content',expect.objectContaining({content_id:'skill-java',action_method:'keyboard'}));
  expect(spy).toHaveBeenCalledWith('[Analytics] command_palette',expect.objectContaining({action:'close',interaction_type:'selection'}));
  spy.mockRestore(); jest.useRealTimers();
});

test('résumé command routes to the embedded résumé page',()=>{
  const opener=jest.spyOn(window,'open').mockReturnValue(null);const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  render(<CommandPalette />);fireEvent.keyDown(window,{key:'k',ctrlKey:true});
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'résumé'}});
  fireEvent.keyDown(screen.getByRole('combobox'),{key:'Enter'});
  expect(mockPush).toHaveBeenCalledWith('/resume');
  expect(opener).not.toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith('[Analytics] select_content',expect.objectContaining({content_type:'resume',source:'command_palette',action_method:'keyboard'}));
  opener.mockRestore();spy.mockRestore();
});
