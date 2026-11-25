import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { m, AnimatePresence, useReducedMotion, useIsPresent } from "framer-motion";
import { trackResumeOpen } from "@/util/analytics";
import styles from "@/components/Home/portfolio.module.scss";
import type { NavbarItem } from "./navbar";
import { visitPortfolioSection } from "./navigationInteraction";
import { usePortfolioMenu } from "./usePortfolioMenu";

type Current = (item: NavbarItem) => "location" | "page" | undefined;

export function PortfolioNavigation({ items, activeSectionId }: { items: NavbarItem[]; activeSectionId: string }) {
  const router = useRouter();
  const { menuOpen, setMenuOpen, overHero, triggerRef, menuRef } = usePortfolioMenu(router.pathname);
  const reduceMotion = useReducedMotion();
  const handleSectionLink = (event: React.MouseEvent<HTMLAnchorElement>, route: string) => visitPortfolioSection(event, route, router);
  const current: Current = item => {
    if (!item.sectionId || activeSectionId !== item.sectionId) return undefined;
    return router.pathname === "/" ? "location" : "page";
  };
  return (
    <header className={styles.portfolioNav} data-over-hero={overHero}>
      <Link href="/" className={styles.portfolioBrand} aria-label="Nirmal Khedkar, home">nirmalhk7</Link>
      <nav className={styles.portfolioDesktopNav} aria-label="Main navigation">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.route}
            aria-current={current(item)}
            data-analytics-skip-global="true"
            onClick={(event) => handleSectionLink(event, item.route)}
          >
            {item.label}
          </Link>
        ))}
        <Link data-analytics-skip-global="true" className={styles.portfolioResume} href="/resume" onClick={() => trackResumeOpen("navigation")}>Resume</Link>
        <button data-analytics-id="search_command_k" data-analytics-skip-global="true" type="button" className={styles.portfolioSearch} onClick={() => window.dispatchEvent(new Event("open-command-palette"))} aria-label="Search, Command K">
          <span>Search</span><kbd>⌘ K</kbd>
        </button>
      </nav>
      <button data-analytics-id="open_navigation_menu"
        type="button"
        className={styles.portfolioMenuTrigger}
        ref={triggerRef}
        data-analytics-skip-global="true" onClick={() => setMenuOpen(true)}
        aria-expanded={menuOpen}
        aria-controls="portfolio-mobile-navigation"
        aria-label="Open navigation menu"
      >
        <span>Menu</span><MenuGlyph open={menuOpen} reduceMotion={Boolean(reduceMotion)} />
      </button>
      <AnimatePresence>
        {menuOpen && (
          <PortfolioMobileMenu items={items} menuRef={menuRef} reduceMotion={Boolean(reduceMotion)} current={current} onSectionLink={handleSectionLink} close={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}

function PortfolioMobileMenu({ items, menuRef, reduceMotion, current, onSectionLink, close }: {
  items: NavbarItem[];
  menuRef: React.RefObject<HTMLElement>;
  reduceMotion: boolean;
  current: Current;
  onSectionLink: (event: React.MouseEvent<HTMLAnchorElement>, route: string) => void;
  close: () => void;
}) {
  return (
    <PortfolioMenuOverlay reduceMotion={reduceMotion}>
      <m.nav
        id="portfolio-mobile-navigation" ref={menuRef} className={styles.portfolioMenuPanel} aria-label="Mobile navigation"
        initial="closed" animate="open" exit="closed"
        variants={{
          closed: { y: reduceMotion ? 0 : -12, transition: { duration: 0.18 } },
          open: { y: 0, transition: { duration: reduceMotion ? 0.1 : 0.36, ease: [0.16, 1, 0.3, 1], staggerChildren: reduceMotion ? 0 : 0.035, delayChildren: reduceMotion ? 0 : 0.04 } },
        }}
      >
        <div className={styles.portfolioMenuHeader}>
          <span>nirmalhk7</span>
          <button data-analytics-id="close_navigation_menu" type="button" data-analytics-skip-global="true" onClick={close} aria-label="Close navigation menu">Close <MenuGlyph open reduceMotion={reduceMotion} /></button>
        </div>
        <ul>
          {items.map((item, index) => (
            <m.li key={item.label} variants={{
              closed: { opacity: 0, y: reduceMotion ? 0 : 8, transition: { duration: 0.1 } },
              open: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0.1 : 0.3, ease: [0.16, 1, 0.3, 1] } },
            }}>
              <Link
                href={item.route}
                aria-current={current(item)}
                data-analytics-skip-global="true"
                onClick={(event) => { onSectionLink(event, item.route); close(); }}
              >
                <span className={styles.portfolioMenuIndex}>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span>
              </Link>
            </m.li>
          ))}
        </ul>
        <div className={styles.portfolioMenuActions}>
          <Link data-analytics-skip-global="true" href="/resume" onClick={() => { trackResumeOpen("navigation"); close(); }}>Resume</Link>
          <button data-analytics-id="navbar_control_17" data-analytics-skip-global="true" type="button" onClick={() => { close(); window.dispatchEvent(new Event("open-command-palette")); }}>Search <kbd>⌘ K</kbd></button>
        </div>
      </m.nav>
    </PortfolioMenuOverlay>
  );
}

function PortfolioMenuOverlay({ children, reduceMotion }: { children: React.ReactNode; reduceMotion: boolean }) {
  const isPresent = useIsPresent();
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (overlayRef.current) overlayRef.current.inert = !isPresent;
  }, [isPresent]);
  return (
    <m.div
      ref={overlayRef}
      className={styles.portfolioMenuOverlay}
      aria-hidden={!isPresent}
      style={{ pointerEvents: isPresent ? "auto" : "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.1 : 0.18 } }}
      transition={{ duration: reduceMotion ? 0.1 : 0.24, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}

function MenuGlyph({ open, reduceMotion }: { open: boolean; reduceMotion: boolean }) {
  return (
    <span className={styles.portfolioMenuGlyph} aria-hidden="true">
      {[0, 1].map((line) => (
        <m.span
          key={line}
          initial={{ y: line === 0 ? -3 : 3, rotate: 0 }}
          animate={{ y: open ? 0 : line === 0 ? -3 : 3, rotate: open ? line === 0 ? 45 : -45 : 0 }}
          transition={{ duration: reduceMotion ? 0 : open ? 0.28 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </span>
  );
}
