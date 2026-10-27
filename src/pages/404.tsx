import React, { useState, useMemo, useEffect } from "react";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { trackClick, trackSearch, trackSelectContent, trackResumeOpen } from "@/util/analytics";
import Link from "next/link";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { selectedProjects } from '@/util/projectCuration';
import { BlogFrontmatterInterface } from "@/interfaces/blog";
import { ProjectInterface } from '@/interfaces/projects';
import { PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";

interface SearchItem {
  title: string;
  url: string;
  type: "page" | "project" | "blog" | "document";
}

interface NotFoundPageProps extends DefaultPageProps {
  searchIndex: SearchItem[];
}

const NotFoundPage = ({ searchIndex }: NotFoundPageProps) => {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return searchIndex.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery) || item.type.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [query, searchIndex]);

  useEffect(() => {
    const searchTerm = query.trim();
    if (searchTerm.length < 2) return;
    const timer = window.setTimeout(() => {
      trackSearch(searchTerm, { search_scope: "404", result_count: filteredItems.length, matched_ids: filteredItems.slice(0,5).map(item=>item.url).join(",") });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [query, filteredItems]);

  return (
    <main className={styles.page}>
      <PageHero
        eyebrow="404 / Page not found"
        title="This page isn’t here."
        description="The address may have changed. Search the site or choose a place to continue."
        compact
      />
      <PageSection eyebrow="Find your way" title="Search the site.">
        <div className={styles.errorSearch} role="search">
          <label htmlFor="not-found-search" className="sr-only">Search projects, articles, and pages</label>
          <input
            id="not-found-search"
            type="search"
            placeholder="Search projects, articles, and pages"
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <div className={styles.searchResults} aria-live="polite">
              {filteredItems.length ? filteredItems.map((item) => { const ResultLink=Link; return (
                <ResultLink key={item.url} href={item.url} onClick={() => {
                  if (item.url==="/resume") trackResumeOpen("404_search_result");
                  else trackSelectContent(item.type, item.url, { source: "404_search_result" });
                }} data-analytics-skip-global="true">
                  <span>{item.title}</span><span className={styles.rowEyebrow}>{item.type} ↗</span>
                </ResultLink>
              ); }) : <p>No results for “{query}”. Try another search.</p>}
            </div>
          )}
          <nav className={styles.errorLinks} aria-label="Suggested pages">
            {[
              { title: "Home", url: "/" },
              { title: "Projects", url: "/projects" },
              { title: "Blog", url: "/blog" },
              { title: "Resume", url: "/resume" },
              { title: "Contact", url: "/#contact" },
            ].map((item) => { const QuickLink=Link; return (
              <QuickLink data-analytics-skip-global="true" key={item.url} href={item.url} onClick={() => item.url==="/resume" ? trackResumeOpen("404_quick_link") : trackClick(item.title, "404_quick_link")}>
                {item.title} ↗
              </QuickLink>
            ); })}
          </nav>
        </div>
      </PageSection>
    </main>
  );
};

export const getStaticProps: GetStaticProps<NotFoundPageProps> = async () => {
  // Build Search Index
  const projects = loadMarkdownFiles<ProjectInterface['frontmatter']>("content/projects", {
    getContent: false,
    getExcerpt: false,
  });

  const blogs = loadMarkdownFiles<BlogFrontmatterInterface>("content/blog", {
    getContent: false,
    getExcerpt: false,
  });

  const searchIndex: SearchItem[] = [
    { title: "Home", url: "/", type: "page" },
    { title: "Projects", url: "/projects", type: "page" },
    { title: "Blog", url: "/blog", type: "page" },
    { title: "Resume", url: "/resume", type: "document" },
    ...projects.map(p => ({
      title: selectedProjects[p.slug]?.title || p.frontmatter.title,
      url: `/projects?id=${encodeURIComponent(p.slug)}`,
      type: "project" as const,
    })),
    ...blogs.map(b => ({
      title: b.frontmatter.title,
      url: `/blog/${b.slug}`,
      type: "blog" as const,
    }))
  ];

  return {
    props: {
      searchIndex,
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Page not Found",
          description: "It's a 404! But let's find you something else interesting.",
          noindex: true,
          nofollow: true,
        },
      },
    },
  };
};

export default NotFoundPage;
