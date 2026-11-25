import React from "react";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { cleanProjectSummary, normalizeTags, selectedProjects } from "@/util/projectCuration";
import { GetStaticProps } from "next";
import { PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";
import { DefaultPageProps } from "./_app";
import type { ProjectInterface, ProjectListEntry } from "@/interfaces/projects";
import { ProjectListItem } from "@/components/Project/projectListItem";
import { renderProjectMarkdown } from "@/util/renderMarkdown";
import { openGraphImage } from "@/util/openGraph";
import motionStyles from "@/components/Project/projectExplorer.module.scss";
import { useProjectFilters } from "@/components/Project/useProjectFilters";
import { useProjectSelection } from "@/components/Project/useProjectSelection";
import { ProjectFilters } from "@/components/Project/ProjectFilters";
import { ProjectSchemas } from "@/components/Project/ProjectSchemas";


interface ProjectPageProps extends DefaultPageProps {
  projects: ProjectListEntry[];
  allTags: string[];
}

const Projects = ({ projects, allTags }: ProjectPageProps) => {
  const filters = useProjectFilters(projects);
  const { browsingAll, filteredProjects, hasFilters, listRef, resetFilters, setShowArchive, showArchive, toggleArchive } = filters;
  const { expandedSlug, projectRefs, handleToggle } = useProjectSelection(setShowArchive, resetFilters);

  return (
    <main className={styles.page}>
      <ProjectSchemas projects={projects} expandedSlug={expandedSlug} />
      <PageHero
        eyebrow=""
        title="Systems, tools, and the work behind them."
        description="A collection of systems, tools, and applications I’ve built to explore ideas and solve practical problems. Each project shows the thinking behind the design and the engineering that brings it to life."
        image={nasaGalaxy}
        imageAlt="Earth seen from space"
      />
      <PageSection id="projectdetailed" title={browsingAll ? 'Explore the work.' : 'My Projects'} description="Open a project for my contribution and technical details. Search covers the entire archive." className={motionStyles.explorer}>
        <ProjectFilters {...filters} allTags={allTags} total={filteredProjects.length} />
        <div ref={listRef}>
          {filteredProjects.map((project, index) => (
            <div className={motionStyles.project} data-project-motion-key={project.slug} key={project.slug} ref={(element) => { projectRefs.current[project.slug] = element; }}>
              <ProjectListItem
                project={project}
                isExpanded={expandedSlug === project.slug}
                onToggle={() => handleToggle(project.slug)}
                index={index}
              />
            </div>
          ))}
        </div>
        {!hasFilters && <button data-analytics-id="projects_control_4" data-analytics-skip-global="true" className={styles.action} type="button" onClick={toggleArchive}>{showArchive ? 'Return to selected work' : `View all ${projects.length} projects`}</button>}
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
