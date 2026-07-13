import React from "react";
import WebSection from "@/elements/WebSection";
import { motion } from "framer-motion";

export default function GitHubActivitySection() {
  return (
    <WebSection
      className="py-24 bg-gray-50 border-y border-gray-200/75 relative overflow-hidden"
      id="github-activity"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
              Open Source & Continuous Delivery
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              GitHub Engineering Activity
            </h3>
          </div>
          <a
            href="https://github.com/nirmalhk7"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gray-900 hover:bg-accent text-white font-semibold text-sm transition-all shadow-md"
          >
            <span>Explore @nirmalhk7 on GitHub</span>
            <span>↗</span>
          </a>
        </div>

        {/* Contribution Stats & Simulated Heatmap Grid */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 mb-6 border-b border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Public Contributions
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                1,420+
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Primary Focus
              </p>
              <p className="text-2xl md:text-3xl font-bold text-accent mt-1">
                Go & Systems
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Repositories
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                32+
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code Quality
              </p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-1">
                A+ Grade
              </p>
            </div>
          </div>

          {/* Visual Activity Bar / Simulated Heatmap */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Contribution Activity Heatmap</span>
              <span>Last 12 Months</span>
            </div>
            <div className="grid grid-cols-26 sm:grid-cols-52 gap-1.5 overflow-x-auto pb-2">
              {Array.from({ length: 52 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const intensityIndex = (weekIndex * 7 + dayIndex) % 5;
                    const colors = [
                      "bg-gray-100",
                      "bg-orange-200",
                      "bg-orange-300",
                      "bg-orange-400",
                      "bg-accent",
                    ];
                    return (
                      <motion.div
                        key={dayIndex}
                        whileHover={{ scale: 1.35 }}
                        className={`w-2.5 h-2.5 rounded-sm ${colors[intensityIndex]} transition-transform cursor-pointer`}
                        title={`Activity level: ${intensityIndex}/4`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WebSection>
  );
}
