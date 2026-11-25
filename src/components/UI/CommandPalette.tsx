import React, { useEffect, useState, useDeferredValue, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter, type NextRouter } from "next/router";
import { trackSearch, trackSelectContent, trackResumeOpen } from "@/util/analytics";

import { CommandPalettePanel } from "./CommandPalettePanel";
import { useCommandDialog } from "./useCommandDialog";
import { useSearchClear } from '@/hooks/useSearchClear';

export interface CommandItem {
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

function followCommand(item: CommandItem, method: string, router: NextRouter) {
  trackSelectContent('command',item.id,{action_method:method,placement:'command_palette'});
  if (item.href === "/resume") {
    trackResumeOpen("command_palette",{action_method:method});
    router.push(item.href);
  } else if (item.newTab) {
    window.open(item.href, "_blank");
  } else {
    router.push(item.href);
  }
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useSearchClear(searchQuery, 'command_palette');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const { inputRef, containerRef, close } = useCommandDialog(isOpen, setIsOpen);

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
    followCommand(item, method, router);
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
        <CommandPalettePanel
          containerRef={containerRef}
          inputRef={inputRef}
          searchQuery={searchQuery}
          filteredItems={filteredItems}
          selectedIndex={selectedIndex}
          close={close}
          selectItem={selectItem}
          setSelectedIndex={setSelectedIndex}
          handleSearchKeyDown={handleSearchKeyDown}
          changeQuery={query => { setSearchQuery(query); setSelectedIndex(0); }}
        />
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
