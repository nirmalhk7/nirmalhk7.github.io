import { pathToFileURL } from 'node:url';
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BASE_URL = "https://nirmalhk7.com";
const EXCLUDED_PAGE_FILES = new Set([
  "_app.tsx",
  "_document.tsx",
  "_error.tsx",
  "404.tsx",
  "500.tsx",
  "design.tsx",
  "index.tsx",
]);

const toDate = (value) => new Date(value).toISOString().slice(0, 10);

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function buildSitemap({
  pagesDir,
  blogDir,
  statSync = fs.statSync,
}) {
  const staticPages = fs
    .readdirSync(pagesDir)
    .filter((file) =>
      file.endsWith(".tsx") &&
      !EXCLUDED_PAGE_FILES.has(file) &&
      !file.startsWith("[") &&
      !statSync(path.join(pagesDir, file)).isDirectory()
    )
    .map((file) => ({
      route: `/${file.replace(/\.tsx$/, "")}`,
    }));

  staticPages.push({
    route: "",
  });

  const blogPosts = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      return {
        draft: data.draft === true,
        route: `/blog/${file.replace(/\.md$/, "")}`,
        lastmod: toDate(data.date || statSync(filePath).mtime),
      };
    })
    .filter((post) => !post.draft);

  const urls = [...staticPages, ...blogPosts]
    .sort((left, right) => left.route.localeCompare(right.route))
    .map(
      ({ route, lastmod }) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${route}`)}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function generateSitemap() {
  const sitemap = buildSitemap({
    pagesDir: path.join(import.meta.dirname, "../src/pages"),
    blogDir: path.join(import.meta.dirname, "../content/blog"),
  });
  fs.writeFileSync(path.join(import.meta.dirname, "../public/sitemap.xml"), sitemap);
  console.log("sitemap.xml generated successfully.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateSitemap();
}

export { buildSitemap, generateSitemap };
