import React from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ProjectInterface } from "@/interfaces/projects";
import { TiltCard } from "@/components/TiltCard";
import Link from "next/link";
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown") as unknown as Promise<{ default: React.ComponentType<{ children: string }> }>);
import { trackClick, trackSelectContent } from "@/util/analytics";

interface ProjectCardProps {
  project: ProjectInterface;
  isExpanded?: boolean;
  onToggle?: () => void;
  onPreview?: (e: React.MouseEvent) => void;
  index: number;
  href?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isExpanded = false,
  onToggle,
  onPreview,
  index,
  href,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const CardContent = (
    <div
      className={`relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full no-underline ${
        isExpanded ? "ring-2 ring-accent/20" : ""
      }`}
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={false}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                backgroundPosition: ["160% 0%", "-60% 0%"],
              }
        }
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.42) 42%, rgba(217,56,56,0.14) 50%, transparent 62%)",
          backgroundSize: "220% 100%",
        }}
      />
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl tablet:text-3xl font-bold group-hover:text-accent transition-colors">
          {project.frontmatter.title}
        </h3>
        <div className="flex flex-wrap gap-2 justify-end">
          {project.frontmatter.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-blocky font-bold uppercase tracking-wider transition group-hover:bg-accent group-hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed text-lg mb-6 line-clamp-3">
        {project.excerpt || project.frontmatter.summary || ""}
      </p>

      <AnimatePresence>
        {isExpanded && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-200/50 mt-4 pt-6"
          >
            <div className="prose prose-lg max-w-none prose-accent">
              <ReactMarkdown>{project.content || ""}</ReactMarkdown>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
              className="mt-8 text-accent font-bold flex items-center gap-2 group/btn"
            >
              <span className="group-hover/btn:-translate-x-1 transition-transform">
                ←
              </span>
              Show Less
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <div className="mt-auto pt-6 border-t border-gray-200/50 flex justify-between items-center">
          <span className="text-accent font-bold flex items-center gap-2 group/link no-underline">
            {href ? "View Project" : "View Details"}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </span>
          {onPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(e);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors"
            >
              Quick Preview
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <m.div
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28, rotateX: 8 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={isExpanded || shouldReduceMotion ? undefined : { y: -8 }}
      whileTap={isExpanded || shouldReduceMotion ? undefined : { scale: 0.99 }}
      transition={{
        delay: index * 0.05,
        layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.2, ease: "easeOut" },
      }}
      className={`w-full h-full ${isExpanded ? "col-span-full" : ""}`}
    >
      <TiltCard
        className={`flex flex-col h-full group transition-all duration-300 ${
          isExpanded ? "cursor-default" : "cursor-pointer"
        }`}
        onClick={!isExpanded && !href ? onToggle : undefined}
      >
        {href ? (
          <Link
            href={href}
            prefetch={false}
            className="h-full block no-underline hover:no-underline"
            data-analytics-skip-global="true"
            onClick={() => {
              trackSelectContent("project", project.slug, {
                item_list_name: "project_card_grid",
                item_index: index,
              });
              trackClick(project.slug, "project_card");
            }}
          >
            {CardContent}
          </Link>
        ) : (
          CardContent
        )}
      </TiltCard>
    </m.div>
  );
};
