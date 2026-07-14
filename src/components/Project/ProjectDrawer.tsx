import React from "react";
import { m, AnimatePresence } from "framer-motion";
import { ProjectInterface } from "@/interfaces/projects";
import Image from "next/image";

interface ProjectDrawerProps {
  project: ProjectInterface | null;
  onClose: () => void;
}

export default function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Drawer Panel */}
          <m.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[95] shadow-2xl overflow-y-auto flex flex-col justify-between p-8 md:p-12"
          >
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Project Quick Preview
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors"
                  aria-label="Close project preview"
                >
                  ✕
                </button>
              </div>

              {/* Title & Description */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                {project.frontmatter.title}
              </h2>

              {(project.frontmatter.summary || project.excerpt) && (
                <p className="text-lg leading-relaxed text-gray-600 mb-8">
                  {project.frontmatter.summary || project.excerpt}
                </p>
              )}

              {/* Hero Image if available */}
              {project.frontmatter.heroImage && (
                <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-gray-200 shadow-sm">
                  <Image
                    src={project.frontmatter.heroImage}
                    alt={project.frontmatter.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Highlights / Features */}
              {project.frontmatter.highlights && project.frontmatter.highlights.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Architectural Highlights
                  </h4>
                  <ul className="space-y-2.5">
                    {project.frontmatter.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-base text-gray-700"
                      >
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="pt-8 border-t border-gray-200 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close Drawer
              </button>
              <a
                href={`/projects?id=${project.slug}`}
                className="px-8 py-3 rounded-xl bg-accent hover:bg-orange-600 text-white font-semibold transition-colors shadow-md"
              >
                View Full Project Page →
              </a>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
