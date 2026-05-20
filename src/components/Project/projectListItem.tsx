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
      className="border-b border-gray-300 last:border-0"
    >
      <button
        onClick={onToggle}
        className={`w-full py-8 px-8 flex flex-col md:flex-row md:items-center justify-between text-left transition-all duration-300 group border-0 ${
          isExpanded ? "bg-accent text-white" : "bg-gray-100 hover:bg-gray-200 text-black"
        }`}
      >
        <div className="flex-grow">
          <h3 className={`text-3xl transition-colors normal-case tracking-normal ${
            isExpanded ? "text-white" : "text-black"
          }`}>
            {project.frontmatter.title}
          </h3>
          <div className={`flex gap-3 text-lg font-blocky font-bold uppercase tracking-normal mt-1 ${
            isExpanded ? "text-white/80" : "text-gray-400"
          }`}>
            {project.frontmatter.tags?.map((tag, i, arr) => (
              <React.Fragment key={tag}>
                <span className={isExpanded ? "text-white" : "group-hover:text-black transition-colors"}>
                  {tag}
                </span>
                {i < arr.length - 1 && (
                  <span className={isExpanded ? "text-white/40" : "text-gray-300"}>/</span>
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

        <div className="flex mt-4 md:mt-0 md:ml-6 items-center">
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className={`text-2xl hidden md:block transition-colors ${
              isExpanded ? "text-white" : "text-gray-400 group-hover:text-black"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 bg-accent text-white">
              <div className="prose prose-lg max-w-none prose-invert border-0 pt-8">
                <ReactMarkdown>{project.content || ""}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
