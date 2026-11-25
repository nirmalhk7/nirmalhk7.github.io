import Link from "next/link";
import React from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { trackClick } from "@/util/analytics";
import type { NavbarItem } from "./navbar";
import { scrollLegacyAnchor } from "./navigationInteraction";

interface LegacyProps {
  navbarInternalData: NavbarItem[];
  activeSectionId: string;
  pathname: string;
  mobileMenuClick: boolean;
  mobileMenuSet: (open: boolean) => void;
  isScrolled: boolean;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

export function LegacyNavigation({ navbarInternalData, activeSectionId, pathname, mobileMenuClick, mobileMenuSet, isScrolled, hoveredIndex, setHoveredIndex }: LegacyProps) {
  const reduceMotion = useReducedMotion();
  const activeIndex = navbarInternalData.findIndex(item => item.sectionId === activeSectionId);
  const highlightedIndex = hoveredIndex ?? activeIndex;
  const backdrop = isScrolled && !mobileMenuClick ? "blur(12px)" : "none";
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    trackClick(route, "navbar_link");
    mobileMenuSet(false);
    scrollLegacyAnchor(event, route, pathname);
  };
  return (
    <m.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
      }}
      className={`font-blocky transition-all duration-300 font-bold text-base leading-[7.2rem] tracking-[0.25rem] uppercase w-full h-navbar z-50 selection:bg-accent selection:text-white ${
        isScrolled || mobileMenuClick
          ? "fixed top-0 text-white shadow-lg bg-black/80"
          : "absolute top-0 bg-transparent text-white"
      }`}
    >
      <LegacyMobileLinks items={navbarInternalData} activeSectionId={activeSectionId} open={mobileMenuClick} reduceMotion={Boolean(reduceMotion)} click={handleLinkClick} />

      <Link
        href="/"
        data-analytics-skip-global="true"
        onClick={(e) => handleLinkClick(e, "/")}
        className={`text-white no-underline left-20 inline-block m-0 p-0 absolute hover:text-accent ${
          mobileMenuClick ? "opacity-0 invisible" : "opacity-100 visible"
        }`}
      >
        nirmalhk7
      </Link>

      <nav className="header-nav-wrap absolute right-20 hidden tablet:block">
        <ul className="header-nav-wrap__navbar inline-flex items-center h-16 m-0 list-none">
          {navbarInternalData.map((element, index) => (
            <m.li
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="pl-0 mr-8 relative group"
              key={element.label}
            >
              <Link
                className={`hover:text-accent relative z-10 transition-colors ${
                  activeSectionId === element.sectionId ? "text-accent" : ""
                }`}
                title={element.label}
                href={element.route}
                data-analytics-skip-global="true"
                onClick={(e) => handleLinkClick(e, element.route)}
              >
                {element.label}
              </Link>
              {highlightedIndex === index && (
                <m.div
                  layoutId="navbar-hover"
                  className="absolute inset-x-[-12px] inset-y-[-4px] bg-accent/20 rounded-lg z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </m.li>
          ))}
          <li className="pl-0 ml-2">
            <button data-analytics-id="navbar_control_7" data-analytics-skip-global="true"
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="!border !border-white/20 !leading-normal !tracking-normal !normal-case px-3 py-1.5 rounded-lg bg-white/10 hover:bg-accent hover:!border-accent text-white text-xs font-mono transition-all flex items-center space-x-1.5 shadow-sm"
              title="Open Command Palette (Cmd + K)"
            >
              <span>⌘K</span>
              <span className="hidden laptop:inline">Search</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="absolute right-10 top-0 h-full flex items-center tablet:hidden z-[60]">
        <button data-analytics-skip-global="true"
          type="button"
          className={`header-menu-toggle !static !block ${
            mobileMenuClick ? "is-clicked" : ""
          }`}
          id="nav-button"
          onClick={() => mobileMenuSet(!mobileMenuClick)}
          aria-expanded={mobileMenuClick}
          aria-controls="mobile-navigation"
        >
          <span>Menu</span>
        </button>
      </div>
    </m.header>
  );
}

function LegacyMobileLinks({ items, activeSectionId, open, reduceMotion, click }: {
  items: NavbarItem[];
  activeSectionId: string;
  open: boolean;
  reduceMotion: boolean;
  click: (event: React.MouseEvent<HTMLAnchorElement>, route: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <m.nav
          id="mobile-navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="header-nav-wrap fixed inset-0 w-full h-screen bg-black p-10 tablet:hidden"
        >
          <ul className="header-nav-wrap__navbar inline-block h-16 m-0 list-none mt-20">
            {items.map((element) => (
              <li
                className="pl-0 relative group"
                key={element.label}
              >
                <Link
                  className={`hover:text-accent relative z-10 transition-colors ${
                    activeSectionId === element.sectionId ? "text-accent" : ""
                  }`}
                  title={element.label}
                  href={element.route}
                  data-analytics-skip-global="true"
                  onClick={(e) => click(e, element.route)}
                >
                  {element.label}
                </Link>
              </li>
            ))}
          </ul>
        </m.nav>
      )}
    </AnimatePresence>
  );
}
