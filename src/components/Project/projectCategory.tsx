import { ProjectInterface } from "@/interfaces/projects";
import { ProjectAccordionItem } from "./projectAccordionItem";
import React from "react";

export const ProjectCategory = ({
  tag,
  projects,
}: {
  tag: string;
  projects: ProjectInterface[];
}) => (
  <div className="break-inside-avoid mb-4" key={tag}>
    <h6 id={tag}>{tag}</h6>
    {projects.map((project) => (
      <ProjectAccordionItem project={project} key={project.slug} />
    ))}
  </div>
);
