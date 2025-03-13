import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
} from "react-accessible-accordion";
import Link from "next/link";
import WebSection from "@/elements/WebSection";
import { ProjectInterface } from "@/interfaces/projects";



const ProjectIntroSection = ({
  projects,
}: {
  projects: ProjectInterface[];
}) => (
  <WebSection
    className="bg-gray-100 selection:bg-accent selection:text-white"
    id="project"
  >
    <div className="mobile-l:container mx-auto">
      <div className="grid grid-cols-1  tablet:grid-cols-2">
        <div className="mb-8 tablet:mb-0">
          <div className="pb-6 relative">
            <div className=" text-center">
              <h3 className="font-blocky font-semibold mb-0 mt-0 uppercase text-accent">
                Projects
              </h3>
              <h1 className="font-bold font-heading leading-snug mt-0 hover:text-black transition duration-500">
                See My Latest Projects
              </h1>
              <p className="lead">
                Find my projects <Link href="/projects">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <div>
          <Accordion className="accordion">
            {/* TODO NK Needs animations */}
            {projects.map((element) => (
              <AccordionItem
                className="accordion__item"
                key={element.frontmatter.title}
              >
                <AccordionItemHeading>
                  <AccordionItemButton className="accordion-header">
                    {element.frontmatter.title}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="p-6 bg-white">
                  <div className="accordion-body__contents">
                    <p>{element.excerpt}</p>
                    <Link href={`/projects?id=${element.slug}`}>
                      Find more here
                    </Link>
                    .&nbsp;&nbsp;&nbsp;
                    {element.frontmatter.tags && element.frontmatter.tags.length > 0 && (
                      <code>{element.frontmatter.tags[0]}</code>
                    )}
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </WebSection>
);
export default ProjectIntroSection;
