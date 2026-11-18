import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import IndexPage, { getStaticProps } from '@/pages/index';

// Static rendering does not run layout effects; the browser pass checks real motion.
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));
jest.mock('next/image', () => ({ __esModule: true, default: () => null }));
jest.mock('next/router', () => ({ useRouter: () => ({ asPath: '/' }) }));
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

type Article = { slug: string; title: string; date?: string; description?: string; body?: string };
const articles: Article[] = [
  { slug: 'a-old', title: 'Old article', date: '2024-01-01' },
  { slug: 'b-newest', title: 'Newest article', date: '2026-11-13', description: 'A source-backed description.' },
  { slug: 'c-middle', title: 'Middle article', date: '2026-10-26', body: 'A useful fallback excerpt.' },
];

async function renderHome(blogs: Article[] = articles) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hiring-home-'));
  fs.mkdirSync(path.join(root, 'content/blog'), { recursive: true });
  for (const directory of ['projects', 'yml']) {
    fs.symlinkSync(path.join(process.cwd(), 'content', directory), path.join(root, 'content', directory));
  }
  for (const blog of blogs) {
    const metadata = { title: blog.title, date: blog.date, description: blog.description, tags: [], category: [] };
    fs.writeFileSync(path.join(root, 'content/blog', `${blog.slug}.md`), `---\n${JSON.stringify(metadata)}\n---\n${blog.body || ''}\n`);
  }
  const cwd = jest.spyOn(process, 'cwd').mockReturnValue(root);
  try {
    const result = await getStaticProps({} as never);
    if (!('props' in result)) throw new Error('Missing homepage props');
    const props = await result.props;
    const html = renderToStaticMarkup(<IndexPage {...props} />);
    return new DOMParser().parseFromString(html, 'text/html');
  } finally {
    cwd.mockRestore();
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// Catches stale links, ascending dates, and missing two-post limit.
it('renders only the latest two articles, newest first, with dates and descriptions', async () => {
  const document = await renderHome();
  const writing = document.querySelector('#blog');
    if (!writing) throw new Error('Missing writing section');
  const links = Array.from(writing.querySelectorAll('a[href^="/blog/"]'));
  expect(links.map(link => link.getAttribute('href'))).toEqual(['/blog/b-newest', '/blog/c-middle']);
  expect(links.map(link => link.textContent?.replace(/\s+/g, ' ').trim())).toEqual(['Newest article', 'Middle article']);
  expect(Array.from(writing.querySelectorAll('time')).map(time => time.dateTime)).toEqual(['2026-11-13', '2026-10-26']);
  expect(writing.textContent).toContain('A source-backed description.');
  expect(writing.textContent).toContain('A useful fallback excerpt.');
  expect(writing.querySelector('h2')?.textContent).toBe('Latest writing');
});

// Catches an empty slot, invalid date, missing-title truncation, or crash on sparse data.
it.each([
  { name: 'empty collection', blogs: [] as Article[] },
  { name: 'one undated article', blogs: [{ slug: 'one', title: 'A very long engineering article title with enough detail to wrap across several lines without being truncated' }] },
])('renders $name without fabricated metadata', async ({ blogs }) => {
    const document = await renderHome(blogs);
    const writing = document.querySelector('#blog');
    if (!writing) throw new Error('Missing writing section');
    expect(writing.querySelectorAll('article')).toHaveLength(blogs.length);
    expect(writing.querySelectorAll('time')).toHaveLength(0);
    expect(writing.textContent).not.toContain('Invalid Date');
    expect(writing.querySelector('a[href="/blog"]')).not.toBeNull();
    if (blogs[0]) expect(writing.querySelector('h3')?.textContent).toBe(blogs[0].title);
});

// Catches an interstitial pushing experience away, reordered sections, or lost anchors.
it('keeps the restored cinematic story before experience and preserves the remaining sequence', async () => {
  const document = await renderHome();
  expect(Array.from(document.querySelectorAll('main section[id]:not(#contact)')).map(section => section.id)).toEqual([
    'max-jumbo', 'engineering', 'workexperience', 'project', 'blog', 'about',
  ]);
  expect(document.querySelector('[data-navigation-story]')?.nextElementSibling?.id).toBe('workexperience');
});

// Catches a missing featured project, duplicate entry, or wrong navigation destination.
it('features Whirlwind once with a readable workflow and the real project destinations', async () => {
  const document = await renderHome();
  const projects = document.querySelector('#project');
  if (!projects) throw new Error('Missing projects section');
  expect(projects.querySelectorAll('a[href="/projects?id=whirlwind"]')).toHaveLength(1);
  expect(projects.querySelector('a[href="https://github.com/nirmalhk7/whirlwind"]')).not.toBeNull();
  expect(projects.querySelectorAll('h3')).toHaveLength(1);
  expect(projects.querySelector('h3')?.textContent).toBe('Whirlwind');
  const diagram = projects.querySelector('svg[role="img"]');
  expect(diagram?.querySelector('title')?.textContent).toContain('Whirlwind');
  expect(diagram?.querySelector('desc')?.textContent).toContain('SQLite');
  expect(projects.textContent).toContain('Simplified workflow');
  expect(Array.from(projects.querySelectorAll('a[href^="/projects?id="]')).map(link => link.getAttribute('href'))).toEqual([
    '/projects?id=whirlwind', '/projects?id=k8-autoscaler', '/projects?id=atskit', '/projects?id=scholarhub', '/projects?id=MedicalVR',
  ]);
});
