import React, { useEffect, useState, useRef, useDeferredValue, useMemo } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/router";
import { trackEvent, trackSearch, trackSelectContent, trackResumeOpen } from "@/util/analytics";

import portfolioStyles from "@/components/Home/portfolio.module.scss";
import styles from "./commandPalette.module.scss";

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
  { id: "about", title: "About Me", category: "Pages", subtitle: "Backend, infrastructure, and broader product engineering", href: "/#about" },
  { id: "projects", title: "Projects Catalogue", category: "Pages", subtitle: "Explore high-performance systems and full-stack projects", href: "/projects" },
  { id: "blog", title: "Blog & Technical Manuals", category: "Pages", subtitle: "The Blue Green Manual", href: "/blog" },
  { id: "contact", title: "Contact / Hire Nirmal", category: "Actions", subtitle: "Send a message or get in touch", href: "/#contact" },
  { id: "resume-action", title: "View résumé", category: "Actions", subtitle: "View embedded résumé", href: "/resume" },
  { id: "skill-java", title: "Java / Reactive services", category: "Skills", subtitle: "Spring Boot to Project Reactor migration at Visa", href: "/#workexperience" },
  { id: "skill-dist", title: "Distributed Systems & Scalability", category: "Skills", subtitle: "Experience at Visa building reliable payments systems", href: "/#about" },
  { id: "skill-react", title: "React & Next.js Full-Stack", category: "Skills", subtitle: "Modern responsive web applications", href: "/projects" },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = (reason: string) => { trackEvent('command_palette',{action:'close',interaction_type:reason}); setIsOpen(false); };
  const open = (method: string) => { trackEvent('command_palette',{action:'open',action_method:method}); setIsOpen(true); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) close('shortcut'); else open('keyboard');
      } else if (e.key === "Escape" && isOpen) {
        close('escape');
      }
    };

    const handleCustomOpen = () => open('control');

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
      const timer=window.setTimeout(() => inputRef.current?.focus(),50);
      return () => window.clearTimeout(timer);
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

  const filteredItems = useMemo(() => commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(deferredQuery.toLowerCase()))
  ), [deferredQuery]);

  useEffect(() => {
    if (!isOpen || !searchQuery.trim()) return;
    const timer=window.setTimeout(()=>trackSearch(searchQuery,{search_scope:'command_palette',result_count:filteredItems.length,matched_ids:filteredItems.slice(0,5).map(item=>item.id).join(',')}),700);
    return ()=>window.clearTimeout(timer);
  }, [isOpen,searchQuery,filteredItems]);

  const selectItem = (item: CommandItem, method: string) => {
    trackSelectContent('command',item.id,{action_method:method,placement:'command_palette'});
    if (item.href === "/resume") {
      trackResumeOpen("command_palette",{action_method:method});
      router.push(item.href);
    } else if (item.newTab) {
      window.open(item.href, "_blank");
    } else {
      router.push(item.href);
    }
    close('selection');
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
      selectItem(filteredItems[selectedIndex],'keyboard');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-analytics-skip-global="true" className={`${portfolioStyles.shell} ${styles.overlay}`}>
          {/* Backdrop */}
          <m.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => close('backdrop')}
            className={styles.backdrop}
          />

          {/* Search panel */}
          <m.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.18, ease: "easeOut" }}
            className={styles.panel}
          >
            {/* Search Header */}
            <div className={styles.header}>
              <div className={styles.inputGroup}>
                <svg className={styles.searchIcon} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-label="Search pages, skills, or quick actions"
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
                  className={styles.input}
                />
              </div>
              <button type="button" className={styles.close} onClick={() => close("control")} aria-label="Close search">
                <span>Close</span><kbd>Esc</kbd>
              </button>
            </div>

            {/* Search results */}
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Search results"
              className={styles.results}
            >
              {filteredItems.length === 0 ? (
                <div className={styles.empty}>
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
                    onClick={(event) => selectItem(item,event.detail===0?'keyboard':'pointer')}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={styles.result}
                  >
                    <div className={styles.resultCopy}>
                      <div className={styles.title}>
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className={styles.subtitle}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    <span className={styles.category}>
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer Tip */}
            <div className={styles.footer}>
              <span>Use arrow keys <strong >↑ ↓</strong> to navigate, <strong >Enter</strong> to select</span>
              <span>Command Palette</span>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
