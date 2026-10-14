import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Projects from '@/pages/projects';
import { normalizeTags, selectedProjects } from '@/util/projectCuration';

jest.mock('react-markdown', () => ({ __esModule: true, default: () => null }));
const mockRouter = { query: {} as { id?: string }, push: jest.fn() };
jest.mock('next/router', () => ({ useRouter: () => mockRouter }));
beforeEach(() => { mockRouter.query = {}; mockRouter.push.mockClear(); });

const projects = [...Object.entries(selectedProjects).map(([slug, brief]) => ({ slug, frontmatter: { title: brief.title, tags: brief.tags, summary: brief.summary }, excerpt: '', contentHtml: '<p>Original source</p>' })), {
  slug: 'legacy', frontmatter: { title: 'Legacy experiment', tags: ['C'], summary: 'Earlier work.' }, excerpt: '', contentHtml: '',
}];

test('normalizes duplicate technology aliases into one option', () => {
  expect(normalizeTags(['c', 'C', 'docker', 'Docker', 'JS', 'javascript'])).toEqual(['C', 'Docker', 'JavaScript']);
});

test('leads with eight selected projects, searches the whole archive, and recovers from empty results', () => {
  render(<Projects projects={projects as never} allTags={['C', 'Docker']} pageMetadata={{enableWrap: true, seoMetadata: { title: 'Projects' }}} />);
  expect(screen.getByRole('status')).toHaveTextContent('8 projects · Selected work');
  expect(screen.queryByRole('button', {name: /Expand Legacy/})).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'legacy' } });
  expect(screen.getByRole('button', {name: 'Expand Legacy experiment details'})).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('1 project · Full archive');
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'does-not-exist' } });
  expect(screen.getByText(/No matching projects/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear search and filters' }));
  expect(screen.getByRole('status')).toHaveTextContent('8 projects · Selected work');
  fireEvent.click(screen.getByRole('button', { name: 'View all 9 projects' }));
  expect(screen.getByRole('status')).toHaveTextContent('9 projects · Full archive');
});

test('records project collapse, archive and clear state, and search catalog results without free text', () => {
  jest.useFakeTimers(); const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  render(<Projects projects={projects as never} allTags={['C','Docker']} pageMetadata={{enableWrap:true,seoMetadata:{title:'Projects'}}} />);
  fireEvent.click(screen.getByRole('button',{name:'View all 9 projects'}));
  expect(spy).toHaveBeenCalledWith('[Analytics] project_archive',expect.objectContaining({action:'show'}));
  fireEvent.click(screen.getByRole('button',{name:'Expand Legacy experiment details'}));
  fireEvent.click(screen.getByRole('button',{name:'Collapse Legacy experiment details'}));
  expect(spy).toHaveBeenCalledWith('[Analytics] project_toggle',expect.objectContaining({content_id:'legacy',action:'collapse'}));
  fireEvent.change(screen.getByRole('searchbox'),{target:{value:'legacy'}});
  jest.advanceTimersByTime(700);
  expect(spy).toHaveBeenCalledWith('[Analytics] site_search',expect.objectContaining({query_length:6,matched_ids:'legacy',result_count:1}));
  fireEvent.click(screen.getByRole('button',{name:'Clear search and filters'}));
  expect(spy).toHaveBeenCalledWith('[Analytics] project_filter',expect.objectContaining({action:'clear'}));
  spy.mockRestore(); jest.useRealTimers();
});

test('opening a search result preserves search when its shallow URL update arrives', () => {
  const props = { projects: projects as never, allTags: ['C', 'Docker'], pageMetadata: { enableWrap: true, seoMetadata: { title: 'Projects' } } };
  const { rerender } = render(<Projects {...props} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'legacy' } });
  fireEvent.click(screen.getByRole('button', { name: 'Expand Legacy experiment details' }));
  mockRouter.query = { id: 'legacy' };
  rerender(<Projects {...props} />);
  expect(screen.getByRole('searchbox')).toHaveValue('legacy');
  expect(screen.getByRole('status')).toHaveTextContent('1 project');
});
