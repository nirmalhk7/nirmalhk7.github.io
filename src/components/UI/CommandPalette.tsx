import React, { useEffect, useState, useRef, useDeferredValue } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

interface CommandItem {
  id: string;
  title: string;
  category: "Pages" | "Skills" | "Actions";
  subtitle?: string;
  href: string;
  newTab?: boolean;
}

const commandItems: CommandItem[] = [
  { id: "home", title: "Home", category: "Pages", subtitle: "Return to homepage", href: "/" },
  { id: "about", title: "About Me", category: "Pages", subtitle: "Full-Stack Engineer specializing in high-performance systems", href: "/#about" },
  { id: "projects", title: "Projects Catalogue", category: "Pages", subtitle: "Explore high-performance systems and full-stack projects", href: "/projects" },
  { id: "blog", title: "Blog & Technical Manuals", category: "Pages", subtitle: "The Blue Green Manual", href: "/blog" },
  { id: "contact", title: "Contact / Hire Nirmal", category: "Actions", subtitle: "Send a message or get in touch", href: "/#contact" },
  { id: "resume-action", title: "Download Resume PDF", category: "Actions", subtitle: "Get official PDF resume", href: "/resume", newTab: true },
  { id: "skill-go", title: "Golang / Systems Engineering", category: "Skills", subtitle: "High throughput backend APIs & concurrent systems", href: "/projects" },
  { id: "skill-dist", title: "Distributed Systems & Scalability", category: "Skills", subtitle: "Experience at Visa building reliable payments systems", href: "/#about" },
  { id: "skill-react", title: "React & Next.js Full-Stack", category: "Skills", subtitle: "Modern responsive web applications", href: "/projects" },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!isOpen || !containerRef.current) return;
      if (e.key === "Tab") {
        const focusableElements = containerRef.current.querySelectorAll(
          'input, button, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleFocusTrap);
    return () => window.removeEventListener("keydown", handleFocusTrap);
  }, [isOpen]);

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredItems = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(deferredQuery.toLowerCase()))
  );

  const selectItem = (item: CommandItem) => {
    if (item.newTab) {
      window.open(item.href, "_blank");
    } else {
      router.push(item.href);
    }
    setIsOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev - 1 < 0 ? Math.max(filteredItems.length - 1, 0) : prev - 1
      );
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      selectItem(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 tablet:pt-24 px-4">
          {/* Backdrop */}
          <m.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container: Bigger (max-w-4xl) with ultra-thin glass border */}
          <m.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-4xl rounded-2xl bg-[#0e0e12]/95 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-white"
          >
            {/* Search Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-2">
              <div className="flex items-center flex-1 mr-4">
                <span className="text-gray-400 text-xl mr-4 select-none">🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-autocomplete="list"
                  aria-controls="command-palette-listbox"
                  aria-activedescendant={
                    filteredItems[selectedIndex]
                      ? `cmd-item-${filteredItems[selectedIndex].id}`
                      : undefined
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search pages, skills, or quick actions..."
                  className="w-full bg-transparent py-4 text-xl text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
              <span className="px-2.5 py-1 rounded border border-white/15 bg-white/5 font-mono text-xs text-gray-400 select-none">
                ESC
              </span>
            </div>

            {/* Results List: Spacious & Clean */}
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Search results"
              className="max-h-[480px] overflow-y-auto p-4 space-y-1.5"
            >
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center text-base text-gray-500">
                  No matching results found.
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    id={`cmd-item-${item.id}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    type="button"
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`!border !leading-normal !tracking-normal !normal-case !font-sans w-full text-left flex items-center justify-between px-6 py-4 rounded-xl cursor-pointer transition-all duration-150 ${
                      selectedIndex === index
                        ? "bg-white/10 !border-white/15 shadow-sm"
                        : "hover:bg-white/5 !border-transparent"
                    }`}
                  >
                    <div>
                      <div className="text-base font-semibold text-white">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-sm text-gray-400 mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    <span className="text-xs px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 uppercase tracking-wider font-mono">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer Tip */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 bg-white/[0.02] text-xs text-gray-400">
              <span>Use arrow keys <strong className="text-gray-300">↑ ↓</strong> to navigate, <strong className="text-gray-300">Enter</strong> to select</span>
              <span>Command Palette</span>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
