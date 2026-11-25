import React from "react";
import type { ProjectListEntry } from "@/interfaces/projects";

export function ProjectSchemas({ projects, expandedSlug }: { projects: ProjectListEntry[]; expandedSlug: string | null }) {
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

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
  </>;
}
