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
import { motion, Variants, AnimatePresence } from "framer-motion";
import { trackClick } from "@/util/analytics";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const slideUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
                Find my projects <Link href="/projects" className="hover:text-black transition-colors">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Accordion className="accordion" allowZeroExpanded>
            {projects.map((element) => (
              <motion.div 
                layout
                variants={slideUpItem} 
                key={element.frontmatter.title}
                className="overflow-hidden"
              >
                <AccordionItem
                  className="accordion__item border-b border-gray-200"
                >
                  <AccordionItemHeading>
                    <AccordionItemButton 
                      className="accordion-header w-full text-left py-4 px-6 focus:outline-none hover:bg-white/50 transition-colors flex justify-between items-center"
                      onClick={() => trackClick(element.frontmatter.title, "project_accordion")}
                    >
                      <span className="text-3xl font-semibold">{element.frontmatter.title}</span>
                      <motion.span 
                        animate={{ rotate: 0 }}
                        className="text-accent"
                      >
                        +
                      </motion.span>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel className="p-0">
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 bg-white"
                    >
                      <div className="accordion-body__contents">
                        <p className="mb-4">{element.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Link 
                              href={`/projects?id=${element.slug}`}
                              className="text-accent font-bold hover:underline"
                              onClick={() => trackClick(element.frontmatter.title, "project_detail_link")}
                            >
                              Find more here →
                            </Link>
                          </motion.div>
                          {element.frontmatter.tags && element.frontmatter.tags.length > 0 && (
                            <code className="text-sm">{element.frontmatter.tags[0]}</code>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AccordionItemPanel>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  </WebSection>
);

export default ProjectIntroSection;
