import React from 'react';
import {render,fireEvent,screen} from '@testing-library/react';
import ProjectDrawer from '@/components/Project/ProjectDrawer';
import SectionNavigator from '@/components/UI/SectionNavigator';
import {ProjectInterface} from '@/interfaces/projects';

test('records drawer opening and closure by catalog ID',()=>{
  const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  const project={slug:'atskit',frontmatter:{title:'ATS Kit'},excerpt:'',content:''} as ProjectInterface;
  const {rerender}=render(<ProjectDrawer project={project} onClose={()=>{}} />);
  expect(spy).toHaveBeenCalledWith('[Analytics] project_drawer',expect.objectContaining({content_id:'atskit',action:'open'}));
  rerender(<ProjectDrawer project={null} onClose={()=>{}} />);
  expect(spy).toHaveBeenCalledWith('[Analytics] project_drawer',expect.objectContaining({content_id:'atskit',action:'close'}));
  spy.mockRestore();
});

test('records section navigator destination without DOM text',()=>{
  const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  jest.spyOn(window,'scrollTo').mockImplementation(()=>{});
  render(<SectionNavigator />);
  fireEvent.click(screen.getByRole('button',{name:'Jump to Home'}));
  expect(spy).toHaveBeenCalledWith('[Analytics] section_navigation',expect.objectContaining({section_id:'home'}));
  spy.mockRestore();
});
