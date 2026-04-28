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
import { trackClick } from "@/util/analytics";
import { motion } from "framer-motion";

const ProjectIntroSection = ({
  projects,
}: {
  projects: ProjectInterface[];
}) => (
  <WebSection
    className="bg-gray-100 selection:bg-accent selection:text-white"
    id="project"
  >
    <motion.div 
      className="mobile-l:container mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 tablet:grid-cols-2">
        <div className="mb-8 tablet:mb-0">
          <div className="pb-6 relative">
            <div className="text-center">
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
          <Accordion className="accordion" allowZeroExpanded>
            {projects.map((element) => (
              <AccordionItem
                key={element.frontmatter.title}
                className="accordion__item"
              >
                <AccordionItemHeading>
                  <AccordionItemButton 
                    className="accordion-header"
                    onClick={() => trackClick(element.frontmatter.title, "project_accordion")}
                  >
                    {element.frontmatter.title}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="p-6 bg-white">
                  <div className="accordion-body__contents">
                    <p className="text-2xl mb-4">{element.excerpt}</p>
                    <Link 
                      href={`/projects?id=${element.slug}`}
                      className="text-accent font-bold"
                      onClick={() => trackClick(element.frontmatter.title, "project_detail_link")}
                    >
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
    </motion.div>
  </WebSection>
);

export default ProjectIntroSection;
