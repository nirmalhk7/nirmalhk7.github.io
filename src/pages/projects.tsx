import React, { useEffect, useRef, useState } from "react";
import { trackClick } from "@/util/analytics";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import sampleSize from "lodash/sampleSize";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { GetStaticProps } from "next";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import Jumbotron from "@/elements/jumbotron";
import WebSection from "@/elements/WebSection";
import { DefaultPageProps } from "./_app";
import { ProjectInterface } from "@/interfaces/projects";
import { ProjectDescription } from "@/components/Project/projectDescription";
import { ProjectListItem } from "@/components/Project/projectListItem";
import loadYaml from "@/util/loadYaml";
import path from "path";
import { useRouter } from "next/router";

import { AnimatePresence } from "framer-motion";

interface ProjectPageProps extends DefaultPageProps {
  projects: ProjectInterface[];
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
      router.push(`/projects?id=${slug}`, undefined, { shallow: true });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "X" || project.frontmatter.tags?.includes(filter);
    const searchContent = `${project.frontmatter.title} ${project.frontmatter.tags?.join(" ")} ${project.content || ""}`.toLowerCase();
    const matchesSearch = searchQuery === "" || searchContent.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="bg-white">
      <Jumbotron.Mini
        backgroundImage={nasaGalaxy}
        backgroundImageAlt="Earth from Space"
        title="Projects"
        subtitle="Projects Catalogue of Nirmal Khedkar"
        DescriptionComponent={ProjectDescription}
      />

      <WebSection className="pt-16 pb-48" id="projectdetailed">
        <div className="container mx-auto">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8 px-4">
            <div className="flex-shrink-0">
              <h3 className="text-accent font-blocky uppercase tracking-widest text-sm mb-2">Portfolio</h3>
              <h1 className="text-5xl font-bold">{filter === "X" ? "All" : filter} Projects</h1>
            </div>
            
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
                <button
                  onClick={() => {
                    setFilter("X");
                    trackClick("clear_filter", "project_filter");
                  }}
                  className={`px-8 py-2.5 rounded-full font-blocky text-base uppercase tracking-normal transition-all duration-300 border-2 ${
                    filter === "X" 
                      ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105" 
                      : "bg-white/50 backdrop-blur-sm border-gray-200 text-gray-500 hover:border-black/50 hover:text-black"
                  }`}
                >
                  All
                </button>
                {allTags.sort().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilter(tag);
                      trackClick(tag, "project_filter");
                    }}
                    className={`px-8 py-2.5 rounded-full font-blocky text-base uppercase tracking-normal transition-all duration-300 border-2 ${
                      tag === filter 
                        ? "bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-105" 
                        : "bg-white/50 backdrop-blur-sm border-gray-200 text-gray-500 hover:border-black/50 hover:text-black"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.slug}
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
              ))}
            </AnimatePresence>
            {filteredProjects.length === 0 && (
              <div className="py-32 text-center bg-gray-50">
                <h3 className="text-gray-400 font-heading italic text-2xl">No projects found matching your criteria.</h3>
              </div>
            )}
          </div>
        </div>
      </WebSection>
    </main>
  );
};



export const getStaticProps: GetStaticProps<ProjectPageProps> = async () => {
  const allQuotesYaml = loadYaml<QuoteInterface[]>(path.join(process.cwd(), "content", "yml", "quotes.yaml"));
  const projects = loadMarkdownFiles("content/projects", {
    getContent: true,
    getExcerpt: false,
  }) as unknown as ProjectInterface[];
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.frontmatter.tags || []))
  );

  return {
    props: {
      projects,
      allTags: allTags,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Projects",
          description: "I love what I do. Here's all I do.",
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/projects`,
            images: [
              {
                url: `https://nirmalhk7.com${nasaGalaxy.src}`,
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
