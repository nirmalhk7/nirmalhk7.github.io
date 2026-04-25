const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BASE_URL = 'https://nirmalhk7.com';

function generateSitemap() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const blogDir = path.join(__dirname, '../content/blog');
  const publicDir = path.join(__dirname, '../public');

  const staticPages = fs
    .readdirSync(pagesDir)
    .filter((staticPage) => {
      return (
        ![
          '_app.tsx',
          '_document.tsx',
          '_error.tsx',
          '404.tsx',
          'index.tsx',
        ].includes(staticPage) &&
        !staticPage.startsWith('[') &&
        !fs.statSync(path.join(pagesDir, staticPage)).isDirectory()
      );
    })
    .map((staticPage) => {
      return staticPage.replace('.tsx', '');
    });

  // Add index page
  staticPages.push('');

  const blogPosts = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace('.md', '');
      return `blog/${slug}`;
    });

  const allPages = [...staticPages, ...blogPosts];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      const route = page === '' ? '' : `/${page}`;
      return `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <changefreq>monthly</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('sitemap.xml generated successfully.');
}

generateSitemap();
