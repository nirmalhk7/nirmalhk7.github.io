import React, { useEffect, useRef, useState } from "react";
import { trackClick, trackSearch, trackSelectContent } from "@/util/analytics";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import { loadProjectMarkdownFiles } from "@/util/loadMarkdown";
import { GetStaticProps } from "next";
import Jumbotron from "@/elements/jumbotron";
import WebSection from "@/elements/WebSection";
import { DefaultPageProps } from "./_app";
import { ProjectInterface } from "@/interfaces/projects";
import { ProjectDescription } from "@/components/Project/projectDescription";
import { ProjectListItem } from "@/components/Project/projectListItem";
import { renderProjectMarkdown } from "@/util/renderMarkdown";
import { loadRandomQuote } from "@/util/loadQuote";
import { useRouter } from "next/router";

import { m, AnimatePresence } from "framer-motion";

interface ProjectPageProps extends DefaultPageProps {
  projects: Array<Omit<ProjectInterface, "content"> & { contentHtml: string }>;
  allTags: string[];
}

const Projects = ({ projects, allTags }: ProjectPageProps) => {
  const [filter, setFilter] = useState("X");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const router = useRouter();
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const { id } = router.query;
    if (id && typeof id === "string") {
      setExpandedSlug(id);
      setTimeout(() => {
        const element = projectRefs.current[id];
        if (element) {
          const offset = 100; // Offset for navbar
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  }, [router.query]);

  const handleToggle = (slug: string) => {
    if (expandedSlug === slug) {
      setExpandedSlug(null);
      router.push("/projects", undefined, { shallow: true });
    } else {
      setExpandedSlug(slug);
      trackClick(slug, "project_expand");
      trackSelectContent("project", slug, {
        interaction_type: "expand",
      });
      router.push(`/projects?id=${slug}`, undefined, { shallow: true });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "X" || project.frontmatter.tags?.includes(filter);
    const searchContent = `${project.frontmatter.title} ${project.frontmatter.tags?.join(" ")} ${project.frontmatter.summary || ""} ${project.excerpt || ""} ${project.contentHtml}`.toLowerCase();
    const matchesSearch = searchQuery === "" || searchContent.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const searchTerm = searchQuery.trim();
    if (searchTerm.length < 2) return;

    const timer = window.setTimeout(() => {
      trackSearch(searchTerm, {
        search_scope: "projects",
        result_count: filteredProjects.length,
        active_filter: filter,
      });
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery, filteredProjects.length, filter]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projects.map((project, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://nirmalhk7.com/projects?id=${project.slug}`,
      "name": project.frontmatter.title,
      "description": project.frontmatter.summary || project.excerpt || "",
    })),
  };

  const breadcrumbElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://nirmalhk7.com",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": "https://nirmalhk7.com/projects",
    },
  ];

  const currentProject = expandedSlug
    ? projects.find((p) => p.slug === expandedSlug)
    : null;

  const filterOptions = [
    { tag: "X", label: "All" },
    ...allTags.slice().sort().map((tag) => ({ tag, label: tag })),
  ];

  if (currentProject) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": currentProject.frontmatter.title,
      "item": `https://nirmalhk7.com/projects?id=${currentProject.slug}`,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements,
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Jumbotron.Mini
        backgroundImage={nasaGalaxy}
        backgroundImageAlt="Earth from Space"
        title="Projects"
        subtitle="Projects Catalogue of Nirmal Khedkar"
        DescriptionComponent={ProjectDescription}
      />

      <WebSection className="pt-16 pb-48" id="projectdetailed" deferRender>
        <div className="container mx-auto">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8 px-4">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center w-full xl:justify-end">
              <div className="relative w-full md:max-w-md group">
                <input
                  type="text"
                  placeholder="Search projects, technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 rounded-full bg-white border-2 border-gray-200 shadow-sm focus:border-accent focus:shadow-md transition-all duration-300 outline-none text-lg font-medium text-black placeholder:text-gray-400"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {filterOptions.map(({ tag, label }) => (
                  <button
                    key={tag}
                    data-analytics-skip-global="true"
                    onClick={() => {
                      setFilter(tag);
                      const isAll = tag === "X";
                      trackClick(isAll ? "clear_filter" : tag, "project_filter");
                      trackSelectContent("project_filter", isAll ? "all" : tag, {
                        result_count: isAll
                          ? projects.length
                          : projects.filter((project) => project.frontmatter.tags?.includes(tag)).length,
                      });
                    }}
                    className={`px-8 py-2.5 rounded-full font-blocky text-base uppercase tracking-normal transition-all duration-300 border-2 ${
                      tag === filter 
                        ? `bg-accent border-accent text-white shadow-lg ${tag === "X" ? "shadow-accent/20" : "shadow-accent/30"} scale-105`
                        : "bg-white/50 backdrop-blur-sm border-gray-200 text-gray-500 hover:border-black/50 hover:text-black"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <m.div
                  layout
                  key={project.slug}
                >
                  <div
                    ref={(el) => {
                      projectRefs.current[project.slug] = el;
                    }}
                  >
                    <ProjectListItem
                      project={project}
                      isExpanded={expandedSlug === project.slug}
                      onToggle={() => handleToggle(project.slug)}
                      index={index}
                    />
                  </div>
                </m.div>
              ))}
            </AnimatePresence>
            {filteredProjects.length === 0 && (

              <div className="py-32 text-center bg-gray-50 rounded-b-3xl">
                <h3 className="text-gray-500 font-heading italic text-3xl mb-4 tracking-normal">Checking the archives... looks like I haven&apos;t tackled this one yet.</h3>
                <p className="text-gray-400 text-lg">Maybe try a different search or clear the filters?</p>
              </div>
            )}
          </div>
        </div>
      </WebSection>
    </main>
  );
};



export const getStaticProps: GetStaticProps<ProjectPageProps> = async () => {
  const projectMarkdown = loadProjectMarkdownFiles("content/projects", {
    getContent: true,
    getExcerpt: true,
  }) as unknown as ProjectInterface[];
  const projects = projectMarkdown.map(({ content, ...project }) => ({
    ...project,
    contentHtml: renderProjectMarkdown(content),
  }));
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.frontmatter.tags || []))
  );

  return {
    props: {
      projects,
      allTags: allTags,
      quote: loadRandomQuote(),
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Software Engineering Projects",
          description: "Explore Nirmal Khedkar's software engineering projects across distributed systems, cloud infrastructure, machine learning, web development, and open source.",
          canonical: "https://nirmalhk7.com/projects",
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/projects`,
            images: [
              {
                url: "https://nirmalhk7.com/api/og?title=Software%20Engineering%20Projects",
                alt: "Hi, I'm Nirmal Khedkar",
                width: 1200,
                height: 630
              },
            ],
            },
            },
            },
            },
            };
            };

export default Projects;
