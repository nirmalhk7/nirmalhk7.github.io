import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import WebSection from "@/elements/WebSection";
import { ProjectInterface } from "@/interfaces/projects";
const ProjectDrawer = dynamic(() => import("./ProjectDrawer"), { ssr: false });
import { m, Variants, useReducedMotion } from "framer-motion";
import { ProjectCard } from "./projectCard";
import { trackClick, trackSelectContent } from "@/util/analytics";

const ProjectIntroSection = ({
  projects,
}: {
  projects: ProjectInterface[];
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState<ProjectInterface | null>(null);

  const gridVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <WebSection
      className="bg-gray-100 selection:bg-accent selection:text-white overflow-hidden"
      id="project"
      deferRender
    >
      <div className="container mx-auto relative">
        <m.div
          aria-hidden="true"
          className="absolute -left-24 top-16 hidden h-px w-72 bg-accent/30 laptop:block"
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
        />
        <m.div 
          className="text-center mb-16"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-blocky font-semibold mb-2 uppercase text-accent">
            Projects
          </h3>
          <h2 className="font-bold font-heading leading-snug mt-0">
            See My Latest Projects
          </h2>
          <p className="lead">
            Find my projects <Link href="/projects" className="text-accent no-underline hover:underline">by category on the Projects page</Link>.
          </p>
        </m.div>

        <m.div
          className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8"
          variants={gridVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.12 }}
          style={{ perspective: 1200 }}
        >
          {projects.map((element, index) => (
            <ProjectCard
              key={element.frontmatter.title}
              project={element}
              index={index}
              href={`/projects?id=${element.slug}`}
              onPreview={() => setActiveProject(element)}
            />
          ))}
        </m.div>
        
        <m.div
          className="mt-20 text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        >
          <Link 
            href="/projects" 
            className="button button-accent inline-block no-underline hover:no-underline"
            data-analytics-skip-global="true"
            onClick={() => {
              trackSelectContent("navigation", "view_all_projects", {
                source: "home_project_section",
              });
              trackClick("view_all_projects", "navigation");
            }}
          >
            View All Projects
          </Link>
        </m.div>
      </div>
      <ProjectDrawer project={activeProject} onClose={() => setActiveProject(null)} />
    </WebSection>
  );
};

export default ProjectIntroSection;
