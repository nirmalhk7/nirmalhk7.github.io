import React, { useEffect, useRef, useState, useMemo } from "react";
import { trackSearch, trackSelectContent, trackEvent } from "@/util/analytics";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { cleanProjectSummary, normalizeTags, projectCategory, selectedProjects } from "@/util/projectCuration";
import { GetStaticProps } from "next";
import { PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";
import { DefaultPageProps } from "./_app";
import { ProjectInterface } from "@/interfaces/projects";
import { ProjectListItem } from "@/components/Project/projectListItem";
import { renderProjectMarkdown } from "@/util/renderMarkdown";
import { useRouter } from "next/router";
import { openGraphImage } from "@/util/openGraph";


interface ProjectPageProps extends DefaultPageProps {
  projects: Array<Omit<ProjectInterface, "content"> & { contentHtml: string }>;
  allTags: string[];
}

const Projects = ({ projects, allTags }: ProjectPageProps) => {
  const [filter, setFilter] = useState("X");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [category, setCategory] = useState('All work');
  const router = useRouter();
  const projectId = router.query.id;
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const id = projectId;
    setExpandedSlug(typeof id === 'string' ? id : null);
    if (id && typeof id === "string") {
      if (!selectedProjects[id]) setShowArchive(true);
      setCategory('All work');
      setFilter('X');
      setSearchQuery('');
      const timer = setTimeout(() => {
        const element = projectRefs.current[id];
        if (element) {
          const offset = 100; // Offset for navbar
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [projectId]);

  const handleToggle = (slug: string) => {
    trackEvent("project_toggle", {content_id:slug,action:expandedSlug===slug?"collapse":"expand"});
    if (expandedSlug === slug) {
      setExpandedSlug(null);
      router.push("/projects", undefined, { shallow: true, scroll: false });
    } else {
      setExpandedSlug(slug);
      trackSelectContent("project", slug, {
        interaction_type: "expand",
      });
      router.push(`/projects?id=${encodeURIComponent(slug)}`, undefined, { shallow: true, scroll: false });
    }
  };

  const browsingAll = showArchive || searchQuery.trim().length > 0 || filter !== 'X' || category !== 'All work';
  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesScope = browsingAll || Boolean(selectedProjects[project.slug]);
    const matchesCategory = category === 'All work' || projectCategory(project) === category;
    const matchesFilter = filter === "X" || project.frontmatter.tags?.includes(filter);
    const searchContent = `${project.frontmatter.title} ${project.frontmatter.tags?.join(" ")} ${project.frontmatter.summary || ""} ${project.excerpt || ""} ${project.contentHtml}`.toLowerCase();
    const matchesSearch = searchQuery === "" || searchContent.includes(searchQuery.toLowerCase());
    return matchesScope && matchesCategory && matchesFilter && matchesSearch;
  }), [projects,browsingAll,category,filter,searchQuery]);

  const clearFilters = () => { trackEvent('project_filter',{action:'clear'}); setSearchQuery(''); setFilter('X'); setCategory('All work'); };

  useEffect(() => {
    const searchTerm = searchQuery.trim();
    if (searchTerm.length < 2) return;

    const timer = window.setTimeout(() => {
      trackSearch(searchTerm, {
        search_scope: "projects",
        result_count: filteredProjects.length,
        active_filter: filter,
        matched_ids: filteredProjects.slice(0,5).map(project=>project.slug).join(","),
      });
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery, filteredProjects, filter]);

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
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow=""
        title="Systems, tools, and the work behind them."
        description="A collection of systems, tools, and applications I’ve built to explore ideas and solve practical problems. Each project shows the thinking behind the design and the engineering that brings it to life."
        image={nasaGalaxy}
        imageAlt="Earth seen from space"
      />
      <PageSection id="projectdetailed" title={browsingAll ? 'Explore the work.' : 'My Projects'} description="Open a project for my contribution and technical details. Search covers the entire archive.">
        <div role="search" aria-label="Search projects">
          <label htmlFor="project-search" className="sr-only">Search projects and technologies</label>
          <input
            id="project-search"
            type="search"
            placeholder="Search projects and technologies"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.searchStatus}>
          <p role="status">{filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} · {browsingAll ? 'Full archive' : 'Selected work'}</p>
          {(searchQuery || filter !== 'X' || category !== 'All work') && <button data-analytics-id="projects_control_1" data-analytics-skip-global="true" type="button" className={styles.filterButton} onClick={clearFilters}>Clear search and filters</button>}
        </div>
        {filteredProjects.length === 0 && <p className={styles.emptyState}>No matching projects. Try another term or clear the filters above.</p>}
        <div className={styles.filterBar} aria-label="Filter projects by area">
          {['All work', 'Systems', 'Product', 'Research'].map(area => <button data-analytics-id="projects_control_2" data-analytics-skip-global="true" key={area} type="button" aria-pressed={area === category} className={`${styles.filterButton} ${area === category ? styles.filterButtonActive : ''}`} onClick={() => { setCategory(area); trackEvent('project_filter',{category:area,action:'category'}); }}>{area}</button>)}
        </div>
        <details data-analytics-id="project_technology_filters" className={styles.technologyFilters}>
          <summary>Filter by technology{filter !== 'X' ? ` · ${filter}` : ''}</summary>
          <div className={styles.filterBar} aria-label="Filter projects by technology">
          {filterOptions.map(({ tag, label }) => (
            <button data-analytics-id="projects_control_3"
              key={tag}
              type="button"
              aria-pressed={tag === filter}
              data-analytics-skip-global="true"
              onClick={() => {
                setFilter(tag);
                const isAll = tag === "X";
                trackEvent("project_filter",{active_filter:isAll?"all":tag,action:"technology"});
              }}
              className={`${styles.filterButton} ${tag === filter ? styles.filterButtonActive : ""}`}
            >
              {label}
            </button>
          ))}
          </div>
        </details>
        <div>
          {filteredProjects.map((project, index) => (
            <div key={project.slug} ref={(element) => { projectRefs.current[project.slug] = element; }}>
              <ProjectListItem
                project={project}
                isExpanded={expandedSlug === project.slug}
                onToggle={() => handleToggle(project.slug)}
                index={index}
              />
            </div>
          ))}
        </div>
        {!searchQuery && filter === 'X' && category === 'All work' && <button data-analytics-id="projects_control_4" data-analytics-skip-global="true" className={styles.action} type="button" onClick={() => { trackEvent('project_archive',{action:showArchive?'hide':'show'}); setShowArchive(current => !current); }}>{showArchive ? 'Return to selected work' : `View all ${projects.length} projects`}</button>}
      </PageSection>
    </main>
  );
};



export const getStaticProps: GetStaticProps<ProjectPageProps> = async () => {
  const projectMarkdown = loadMarkdownFiles("content/projects", {
    getContent: true,
    getExcerpt: true,
  }) as unknown as ProjectInterface[];
  const order = Object.keys(selectedProjects);
  for (const slug of order) {
    if (!projectMarkdown.some((project) => project.slug === slug)) {
      throw new Error(`Missing selected project: ${slug}`);
    }
  }
  const projects = projectMarkdown.map(({ content, ...project }) => ({
    ...project,
    frontmatter: { ...project.frontmatter, title: selectedProjects[project.slug]?.title || project.frontmatter.title, tags: normalizeTags(selectedProjects[project.slug]?.tags || project.frontmatter.tags), summary: selectedProjects[project.slug]?.summary || cleanProjectSummary(project.frontmatter.summary || project.excerpt || '') },
    contentHtml: renderProjectMarkdown(content),
  })).sort((a, b) => {
    const rank = (slug: string) => order.includes(slug) ? order.indexOf(slug) : order.length;
    return rank(a.slug) - rank(b.slug) || a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.frontmatter.tags || []))
  );

  return {
    props: {
      projects,
      allTags: allTags,
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Software Engineering Projects",
          description: "Explore Nirmal Khedkar's software engineering projects across distributed systems, cloud infrastructure, machine learning, web development, and open source.",
          canonical: "https://nirmalhk7.com/projects",
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/projects`,
            images: [openGraphImage("Across the stack.", "Selected projects. From infrastructure to experience.", "projects")],
            },
            },
            },
            },
            };
            };

export default Projects;
