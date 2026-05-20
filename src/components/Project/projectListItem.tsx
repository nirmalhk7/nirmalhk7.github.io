import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectInterface } from "@/interfaces/projects";
import ReactMarkdown from "react-markdown";

interface ProjectListItemProps {
  project: ProjectInterface;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  isExpanded,
  onToggle,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={onToggle}
        className={`w-full py-8 px-4 flex flex-col md:flex-row md:items-center justify-between text-left transition-colors hover:bg-gray-50 group ${
          isExpanded ? "bg-gray-50/50" : ""
        }`}
      >
        <div className="flex-grow">
          <h3 className={`text-2xl font-bold transition-colors ${
            isExpanded ? "text-accent" : "text-gray-900 group-hover:text-accent"
          }`}>
            {project.frontmatter.title}
          </h3>
          {!isExpanded && (
            <p className="text-gray-500 mt-2 line-clamp-1 text-lg">
              {project.excerpt}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0 md:ml-6 items-center">
          <div className="flex gap-3 text-xs font-blocky font-bold uppercase tracking-widest text-gray-400">
            {project.frontmatter.tags?.map((tag, i, arr) => (
              <React.Fragment key={tag}>
                <span className="group-hover:text-gray-600 transition-colors">{tag}</span>
                {i < arr.length - 1 && <span className="text-gray-200">/</span>}
              </React.Fragment>
            ))}
          </div>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-accent text-2xl hidden md:block opacity-50 group-hover:opacity-100 transition-opacity ml-4"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 bg-gray-50/50">
              <div className="prose prose-lg max-w-none prose-accent border-t border-gray-200 pt-8">
                <ReactMarkdown>{project.content || ""}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
