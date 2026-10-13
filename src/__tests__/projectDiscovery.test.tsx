import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Projects from '@/pages/projects';
import { normalizeTags, selectedProjects } from '@/util/projectCuration';

jest.mock('react-markdown', () => ({ __esModule: true, default: () => null }));
jest.mock('next/router', () => ({ useRouter: () => ({ query: {}, push: jest.fn() }) }));

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
