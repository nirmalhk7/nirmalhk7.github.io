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
import { getStaticProps as getResumeProps } from "../pages/resume";
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
  it("publishes complete, unique metadata for every indexable top-level page", async () => {
    const pages = [
      [getHomeProps, "https://nirmalhk7.com"],
      [getProjectsProps, "https://nirmalhk7.com/projects"],
      [getBlogProps, "https://nirmalhk7.com/blog"],
      [getResumeProps, "https://nirmalhk7.com/resume"],
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

  it("keeps the custom 404 out of search indexes", async () => {
    const seo = await readSeo(getNotFoundProps as never);

    expect(seo.noindex).toBe(true);
    expect(seo.nofollow).toBe(true);
    expect(seo.canonical).toBeUndefined();
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
