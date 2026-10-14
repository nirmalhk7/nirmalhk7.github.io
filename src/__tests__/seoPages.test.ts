import fs from "node:fs";
import path from "node:path";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

import { getStaticProps as getHomeProps } from "../pages/index";
import { getStaticProps as getProjectsProps } from "../pages/projects";
import { getStaticProps as getBlogProps } from "../pages/blog";
import {
  getStaticPaths as getBlogPaths,
  getStaticProps as getBlogPostProps,
} from "../pages/blog/[blogId]";
import { getStaticProps as getNotFoundProps } from "../pages/404";
import { getStaticProps as getServerErrorProps } from "../pages/500";

type SeoMetadata = {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraph?: {
    url?: string;
    images?: Array<{ url: string }>;
  };
};

const context = {} as never;

const readSeo = async (
  loader: (context: never) => Promise<unknown>,
  loaderContext: never = context
): Promise<SeoMetadata> => {
  const result = (await loader(loaderContext)) as {
    props: { pageMetadata: { seoMetadata: SeoMetadata } };
  };
  return result.props.pageMetadata.seoMetadata;
};

const expectIndexableMetadata = (
  seo: SeoMetadata,
  canonical: string
) => {
  expect(seo.title).toBeTruthy();
  expect(seo.description?.length).toBeGreaterThanOrEqual(120);
  expect(seo.description?.length).toBeLessThanOrEqual(170);
  expect(seo.canonical).toBe(canonical);
  expect(seo.openGraph?.url).toBe(canonical);
  expect(seo.openGraph?.images?.[0]?.url).toMatch(
    /^https:\/\/nirmalhk7\.com\/(?:api\/og|assets\/)/
  );
};

describe("page SEO contracts", () => {
  it("loads the four fixed, source-backed homepage projects in editorial order", async () => {
    const result = (await getHomeProps(context)) as {
      props: {
        projects: Array<{ slug: string; frontmatter: { summary?: string }; content?: string | null }>;
        pageMetadata: { layoutVariant?: string };
      };
    };

    expect(result.props.pageMetadata.layoutVariant).toBe("portfolio");
    expect(result.props.projects.map((project) => project.slug)).toEqual([
      "k8-autoscaler",
      "atskit",
      "scholarhub",
      "MedicalVR",
    ]);
    expect(result.props.projects.every((project) => !project.content)).toBe(true);
    expect(result.props.projects[2].frontmatter.summary).toContain("Nirmal contributed all frontend work");
  });

  it("publishes complete, unique metadata for every indexable top-level page", async () => {
    const pages = [
      [getHomeProps, "https://nirmalhk7.com"],
      [getProjectsProps, "https://nirmalhk7.com/projects"],
      [getBlogProps, "https://nirmalhk7.com/blog"],
    ] as const;

    for (const [loader, canonical] of pages) {
      expectIndexableMetadata(await readSeo(loader as never), canonical);
    }
  });

  it("publishes complete metadata for every blog post", async () => {
    const staticPaths = await getBlogPaths(context);
    const blogPaths = staticPaths.paths.filter(
      (entry): entry is { params: { blogId: string } } =>
        typeof entry !== "string" && typeof entry.params?.blogId === "string"
    );

    expect(blogPaths).toHaveLength(7);
    for (const { params } of blogPaths) {
      const canonical = `https://nirmalhk7.com/blog/${params.blogId}`;
      const seo = await readSeo(
        getBlogPostProps as never,
        { params } as never
      );
      expectIndexableMetadata(seo, canonical);
    }
  });

  it("gives every shared route its own branded preview and route-specific copy", async () => {
    const pages = [
      [getHomeProps, "home"],
      [getProjectsProps, "projects"],
      [getBlogProps, "writing"],
    ] as const;
    const imageUrls = new Set<string>();
    for (const [loader, section] of pages) {
      const seo = await readSeo(loader as never);
      const image = new URL(seo.openGraph?.images?.[0]?.url || "");
      expect(image.pathname).toBe("/api/og");
      expect(image.searchParams.get("section")).toBe(section);
      expect(image.searchParams.get("title")).toBeTruthy();
      expect(image.searchParams.get("subtitle")).toBeTruthy();
      imageUrls.add(image.href);
    }
    const { paths } = await getBlogPaths(context);
    for (const entry of paths) {
      if (typeof entry === "string") continue;
      const seo = await readSeo(getBlogPostProps as never, { params: entry.params } as never);
      const image = new URL(seo.openGraph?.images?.[0]?.url || "");
      expect(image.pathname).toBe("/api/og");
      expect(image.searchParams.get("section")).toBe("article");
      expect(image.searchParams.get("title")).toBe(seo.title);
      expect(image.searchParams.get("subtitle")).toBeTruthy();
      imageUrls.add(image.href);
    }
    expect(imageUrls.size).toBe(pages.length + paths.length);
  });

  it('keeps local article images renderable and legacy project links resolved', async () => {
    const result = await getBlogPostProps({ params: { blogId: 'conclave' } } as never);
    if (!('props' in result)) throw new Error('Missing article props');
    const { current } = await result.props;
    const images = Array.from((current.content || '').matchAll(/!\[[^\]]*\]\(([^)]*)\)/g));
    expect(images.length).toBeGreaterThan(0);
    for (const [, src] of images) {
      expect(src).toMatch(/^\/assets\//);
      expect(fs.existsSync(path.join(process.cwd(), 'public', src))).toBe(true);
    }
    expect(current.content).toContain('/projects?id=scholarhub');
    expect(current.content).not.toContain('{{site.url}}');
  });

  it("keeps the custom 404 out of search indexes", async () => {
    const seo = await readSeo(getNotFoundProps as never);

    expect(seo.noindex).toBe(true);
    expect(seo.nofollow).toBe(true);
    expect(seo.canonical).toBeUndefined();
  });

  it('keeps legacy article media in supported Markdown rather than displaying raw HTML', () => {
    for (const file of fs.readdirSync(path.join(process.cwd(), 'content/blog'))) {
      const content = fs.readFileSync(path.join(process.cwd(), 'content/blog', file), 'utf8');
      expect(content).not.toMatch(/<(?:center|img|iframe)\b/i);
    }
  });

  it("keeps the server error page out of search indexes", async () => {
    const seo = await readSeo(getServerErrorProps as never);

    expect(seo.noindex).toBe(true);
    expect(seo.nofollow).toBe(true);
    expect(seo.canonical).toBeUndefined();
  });
});

describe("sitemap generator", () => {
  it("excludes redirects and emits last modification dates", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { buildSitemap } = require("../../scripts/generate-sitemap");
    const xml = buildSitemap({
      pagesDir: path.join(process.cwd(), "src/pages"),
      blogDir: path.join(process.cwd(), "content/blog"),
      projectDir: path.join(process.cwd(), "content/projects"),
      statSync: fs.statSync,
    });

    expect(xml).toContain("<loc>https://nirmalhk7.com</loc>");
    expect(xml).not.toContain("<loc>https://nirmalhk7.com/design</loc>");
    expect(xml).not.toContain("<loc>https://nirmalhk7.com/500</loc>");
    expect(xml).toContain("<lastmod>");
  });
});
