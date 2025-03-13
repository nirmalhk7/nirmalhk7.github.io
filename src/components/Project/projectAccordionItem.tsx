import React from "react";
import { ProjectInterface } from "@/interfaces/projects";
import {
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import ReactMarkdown from "react-markdown";

export const ProjectAccordionItem = ({ project }: { project: ProjectInterface }) => (
  <AccordionItem className="accordion__item" key={project.slug}>
    <AccordionItemHeading>
      <AccordionItemButton className="accordion-header bg-white">
        {project.frontmatter.title}
      </AccordionItemButton>
    </AccordionItemHeading>
    <AccordionItemPanel className="p-6 bg-gray-100">
      <ReactMarkdown>{project.content || ""}</ReactMarkdown>
    </AccordionItemPanel>
  </AccordionItem>
);
