import React from "react";
import Link from "next/link";
import WebSection from "@/elements/WebSection";
import { ProjectInterface } from "@/interfaces/projects";
import { motion } from "framer-motion";
import { ProjectCard } from "./projectCard";

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
          <ProjectCard
            key={element.frontmatter.title}
            project={element}
            index={index}
            href={`/projects?id=${element.slug}`}
          />
        ))}
      </div>
      
      <div className="mt-20 text-center">
        <Link 
          href="/projects" 
          className="button button-accent inline-block"
        >
          View All Projects
        </Link>
      </div>
    </div>
  </WebSection>
);

export default ProjectIntroSection;
