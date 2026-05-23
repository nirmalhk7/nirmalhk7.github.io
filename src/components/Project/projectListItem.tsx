import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ProjectInterface } from "@/interfaces/projects";
import ReactMarkdown from "react-markdown";

interface ProjectListItemProps {
  project: ProjectInterface;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const ProjectListItem = React.forwardRef<HTMLDivElement, ProjectListItemProps>(({
  project,
  isExpanded,
  onToggle,
  index,
}, ref) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18, clipPath: "inset(0 0 22% 0)" }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={isExpanded || shouldReduceMotion ? undefined : { y: -3 }}
      transition={{
        delay: index * 0.03,
        layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.18, ease: "easeOut" },
      }}
      className={`transition-all duration-300 ${
        isExpanded 
          ? "border-2 border-accent rounded-3xl my-8 overflow-hidden shadow-xl shadow-accent/5" 
          : "border-b border-gray-200 last:border-0"
      }`}
    >
      <button
        onClick={onToggle}
        className={`relative w-full overflow-hidden py-8 px-8 flex flex-col md:flex-row md:items-center justify-between text-left transition-all duration-300 group border-0 ${
          isExpanded ? "bg-gray-200 text-black" : "bg-gray-100 hover:bg-gray-200 text-black"
        }`}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-accent"
          initial={false}
          animate={{ scaleY: isExpanded ? 1 : 0.18, opacity: isExpanded ? 1 : 0.35 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          style={{ originY: 0.5 }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-white/40 to-transparent opacity-0"
          animate={isExpanded ? { opacity: 1, x: "0%" } : { opacity: 0, x: "-8%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="relative z-10 flex-grow">
          <h3 className={`text-3xl transition-colors normal-case tracking-normal ${
            isExpanded ? "text-accent" : "text-black"
          }`}>
            {project.frontmatter.title}
          </h3>
          <div className={`flex gap-3 text-lg font-blocky font-bold uppercase tracking-normal mt-1 ${
            isExpanded ? "text-accent/60" : "text-gray-400"
          }`}>
            {project.frontmatter.tags?.map((tag, i, arr) => (
              <React.Fragment key={tag}>
                <span className={isExpanded ? "text-accent" : "group-hover:text-black transition-colors"}>
                  {tag}
                </span>
                {i < arr.length - 1 && (
                  <span className={isExpanded ? "text-accent/20" : "text-gray-300"}>/</span>
                )}
              </React.Fragment>
            ))}
          </div>
          {!isExpanded && (
            <p className="text-gray-500 mt-4 line-clamp-1 text-lg font-medium">
              {project.excerpt}
            </p>
          )}
        </div>

        <div className="relative z-10 flex mt-4 md:mt-0 md:ml-6 items-center">
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className={`text-2xl hidden md:block transition-colors ${
              isExpanded ? "text-accent" : "text-gray-400 group-hover:text-black"
            }`}
          >
            ↓
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 bg-gray-200 text-black">
              <div className="prose prose-lg max-w-none prose-neutral border-0 pt-8">
                <ReactMarkdown>{project.content || ""}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ProjectListItem.displayName = "ProjectListItem";
