import React from "react";
import Link from "next/link";
import WebSection from "@/elements/WebSection";
import { ProjectInterface } from "@/interfaces/projects";
import { trackClick } from "@/util/analytics";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/TiltCard";

const ProjectIntroSection = ({
  projects,
}: {
  projects: ProjectInterface[];
}) => (
  <WebSection
    className="bg-gray-100 selection:bg-accent selection:text-white"
    id="project"
  >
    <div className="container mx-auto">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-blocky font-semibold mb-2 uppercase text-accent">
          Projects
        </h3>
        <h1 className="font-bold font-heading leading-snug mt-0">
          See My Latest Projects
        </h1>
        <p className="lead">
          Find my projects <Link href="/projects" className="text-accent hover:underline">categorized here</Link>.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8">
        {projects.map((element, index) => (
          <TiltCard
            key={element.frontmatter.title}
            className="flex flex-col h-full group"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                {element.frontmatter.title}
              </h3>
              <p className="text-gray-600 flex-grow mb-8 leading-relaxed text-xl">
                {element.excerpt}
              </p>
              <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-200/50">
                <Link 
                  href={`/projects?id=${element.slug}`}
                  className="text-accent font-bold flex items-center gap-2 group/link"
                  onClick={() => trackClick(element.frontmatter.title, "project_card_link")}
                >
                  View Project 
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
                {element.frontmatter.tags && element.frontmatter.tags[0] && (
                  <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-blocky font-bold uppercase tracking-wider">
                    {element.frontmatter.tags[0]}
                  </span>
                )}
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </div>
  </WebSection>
);

export default ProjectIntroSection;
