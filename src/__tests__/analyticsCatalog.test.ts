import fs from 'fs';
import path from 'path';
import {blogIds,projectIds} from '@/util/analyticsCatalog';

test.each([['blog',blogIds],['projects',projectIds]] as const)('tracking catalog covers published %s content', (directory,ids)=>{
  const published=fs.readdirSync(path.join(process.cwd(),'content',directory)).filter(file=>file.endsWith('.md')).map(file=>file.slice(0,-3)).sort();
  expect([...ids].sort()).toEqual(published);
});

// A newly published post must be allowed without editing the tracking catalog.
test('analytics discovers added posts and rejects removed posts at config load', () => {
  const post = path.join(process.cwd(), 'content/blog/analytics-catalog-fixture.md');
  const ignored = path.join(process.cwd(), 'content/blog/analytics-catalog-fixture.txt');
  const previous = process.env.NEXT_PUBLIC_BLOG_IDS;
  const loadSanitizer = () => {
    jest.resetModules();
    const config = jest.requireActual('../../next.config.js');
    process.env.NEXT_PUBLIC_BLOG_IDS = config.env.NEXT_PUBLIC_BLOG_IDS;
    return jest.requireActual('@/util/analyticsPrivacy').sanitizeAnalyticsUrl;
  };
  try {
    fs.writeFileSync(post, '---\ntitle: Analytics fixture\n---\nPost.', { flag: 'wx' });
    fs.writeFileSync(ignored, 'Not a post', { flag: 'wx' });
    let sanitize = loadSanitizer();
    expect(sanitize('/blog/analytics-catalog-fixture?secret=private')).toBe('/blog/analytics-catalog-fixture');
    expect(sanitize('/blog/analytics-catalog-fixture.txt')).toBe('/unknown');
    expect(sanitize('/blog/not-published')).toBe('/unknown');
    fs.unlinkSync(post);
    sanitize = loadSanitizer();
    expect(sanitize('/blog/analytics-catalog-fixture')).toBe('/unknown');
  } finally {
    if (fs.existsSync(post)) fs.unlinkSync(post);
    if (fs.existsSync(ignored)) fs.unlinkSync(ignored);
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BLOG_IDS;
    else process.env.NEXT_PUBLIC_BLOG_IDS = previous;
    jest.resetModules();
  }
});
