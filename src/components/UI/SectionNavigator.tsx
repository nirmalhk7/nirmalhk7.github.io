import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "", label: "Home" },
  { id: "about", label: "About" },
  { id: "workexperience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function SectionNavigator() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (!sec.id) {
          if (scrollPosition < 500) {
            setActiveSection("");
            break;
          }
          continue;
        }

        const el = document.getElementById(sec.id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4 py-5 px-3 rounded-full bg-white/75 dark:bg-[#14151a]/75 backdrop-blur-md border border-gray-200/60 dark:border-white/10 shadow-xl transition-all">
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.label}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            className="group relative flex items-center justify-center p-1.5 focus:outline-none"
            aria-label={`Jump to ${sec.label}`}
          >
            {/* Tooltip on left */}
            <span className="absolute right-8 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
              {sec.label}
            </span>

            {/* Indicator Dot / Pill */}
            <motion.div
              animate={{
                height: isActive ? 24 : 8,
                backgroundColor: isActive ? "#ea580c" : "#9ca3af",
              }}
              className="w-2 rounded-full transition-colors duration-300 group-hover:bg-accent"
            />
          </button>
        );
      })}
    </div>
  );
}
