import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion, useIsPresent } from "framer-motion";
import { trackClick, trackEvent, trackResumeOpen } from "@/util/analytics";
import { createRafThrottled } from "@/util/rafThrottle";
import styles from "@/components/Home/portfolio.module.scss";

type NavbarItem = {
  label: string;
  route: string;
  sectionId: string;
};

const Navbar = ({ variant = "default" }: { variant?: "default" | "portfolio" }) => {
  const router = useRouter();
  const [mobileMenuClick, mobileMenuSet] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState("");
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const isPortfolio = variant === "portfolio";

  const navbarInternalData: NavbarItem[] = React.useMemo(
    () => [
      {
        label: "Home",
        route: "/",
        sectionId: "max-jumbo",
      },
      {
        label: "About",
        route: router.pathname === "/" ? "#about" : "/#about",
        sectionId: "about",
      },
      {
        label: "Projects",
        route: router.pathname === "/" ? "#project" : "/projects",
        sectionId: "project",
      },
      {
        label: "Blog",
        route: router.pathname === "/" ? "#blog" : "/blog",
        sectionId: "blog",
      },
      {
        label: "Contact",
        route: router.pathname === "/" ? "#contact" : "/#contact",
        sectionId: "contact",
      },
    ],
    [router.pathname]
  );
  const previousLegacyMenu = useRef(false);
  useEffect(() => { if (previousLegacyMenu.current!==mobileMenuClick) { trackEvent('navigation_menu',{action:mobileMenuClick?'open':'close',placement:'legacy'}); previousLegacyMenu.current=mobileMenuClick; } },[mobileMenuClick]);
  const activeIndex = navbarInternalData.findIndex((item) => item.sectionId === activeSectionId);
  const highlightedIndex = hoveredIndex ?? activeIndex;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    trackClick(route, "navbar_link");
    mobileMenuSet(false);

    if (isPortfolio) {
      return;
    }

    if (route === "/") {
      if (router.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (route.startsWith("#") || (route.startsWith("/#") && router.pathname === "/")) {
      const id = route.includes("#") ? route.split("#")[1] : "";
      if (id) {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", route);
        }
      }
    }
  };

  useEffect(() => {
    if (isPortfolio) {
      if (router.pathname !== "/") return;
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSectionId(visible.target.id);
      }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75] });
      ["max-jumbo", "about", "workexperience", "project", "blog", "contact"].forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
      return () => observer.disconnect();
    }

    const handleScroll = () => {
      const hero = document.getElementById("max-jumbo") || document.getElementById("hero-header") || document.querySelector(".page-header");
      const heroHeight = hero ? (hero as HTMLElement).offsetHeight : window.innerHeight;
      
      if (window.scrollY >= heroHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const scheduledScroll = createRafThrottled(handleScroll);
    window.addEventListener("scroll", scheduledScroll, { passive: true });
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", scheduledScroll);
      scheduledScroll.cancel();
    };
  }, [isPortfolio, router.pathname]);

  useEffect(() => {
    if (isPortfolio) {
      if (router.pathname !== "/") {
        setActiveSectionId(router.pathname.startsWith("/projects") ? "project" : router.pathname.startsWith("/blog") ? "blog" : "");
        return;
      }
      return;
    }
    if (router.pathname !== "/") {
      if (router.pathname.startsWith("/projects")) {
        setActiveSectionId("project");
      } else if (router.pathname.startsWith("/blog")) {
        setActiveSectionId("blog");
      } else {
        setActiveSectionId("");
      }
      return;
    }

    const sectionIds = navbarInternalData
      .map((item) => item.sectionId)
      .filter(Boolean);

    const updateActiveSection = () => {
      const viewportMarker = window.scrollY + 140;
      const documentBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));

      if (documentBottom && sections.some((section) => section.id === "contact")) {
        setActiveSectionId("contact");
        return;
      }

      const activeSection = sections.reduce<HTMLElement | null>((current, section) => {
        return section.offsetTop <= viewportMarker ? section : current;
      }, null);

      setActiveSectionId(activeSection?.id || "");
    };

    updateActiveSection();
    const timeoutId = window.setTimeout(updateActiveSection, 500);
    const scheduledUpdate = createRafThrottled(updateActiveSection);
    window.addEventListener("scroll", scheduledUpdate, { passive: true });
    window.addEventListener("resize", scheduledUpdate);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", scheduledUpdate);
      window.removeEventListener("resize", scheduledUpdate);
      scheduledUpdate.cancel();
    };
  }, [router.pathname, navbarInternalData, isPortfolio]);

  if (isPortfolio) {
    return <PortfolioNavigation items={navbarInternalData} activeSectionId={activeSectionId} />;
  }

  return (
    <m.header
      initial={isPortfolio ? false : { y: -100, opacity: 0 }}
      animate={isPortfolio ? undefined : { y: 0, opacity: 1 }}
      transition={isPortfolio ? undefined : { duration: 0.8, ease: "easeOut" }}
      style={{
        backdropFilter: isScrolled && !mobileMenuClick ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled && !mobileMenuClick ? "blur(12px)" : "none",
      }}
        className={`font-blocky transition-all duration-300 font-bold text-base leading-[7.2rem] tracking-[0.25rem] uppercase w-full h-navbar z-50 selection:bg-accent selection:text-white ${
        isScrolled || mobileMenuClick
          ? "fixed top-0 text-white shadow-lg bg-black/80" 
          : "absolute top-0 bg-transparent text-white"
      }`}
    >
      <AnimatePresence>
        {mobileMenuClick && (
          <m.nav
            id="mobile-navigation"
            initial={isPortfolio && reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: isPortfolio ? 0.16 : 0.3 }}
          ref={mobileMenuRef}
          className={`header-nav-wrap fixed inset-0 w-full h-screen bg-black p-10 tablet:hidden ${isPortfolio ? styles.portfolioMobileMenu : ""}`}
          >
            <ul className="header-nav-wrap__navbar inline-block h-16 m-0 list-none mt-20">
              {navbarInternalData.map((element) => (
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
                    onClick={(e) => handleLinkClick(e, element.route)}
                  >
                    {element.label}
                  </Link>
                </li>
              ))}
              {isPortfolio && <li><Link data-analytics-skip-global="true" href="/resume" target="_blank" rel="noopener noreferrer" onClick={() => { mobileMenuSet(false); trackResumeOpen("navigation"); }}>Resume</Link></li>}
              {isPortfolio && <li><button data-analytics-id="navbar_control_3" data-analytics-skip-global="true" type="button" className="portfolio-mobile-search" onClick={() => { mobileMenuSet(false); window.dispatchEvent(new Event("open-command-palette")); }}>Search <span>⌘K</span></button></li>}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>

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
                  transition={isPortfolio
                    ? { type: "tween", duration: 0.16 }
                    : { type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </m.li>
          ))}
          {isPortfolio && <li className="pl-0 mr-5 relative"><Link data-analytics-skip-global="true" className="portfolio-resume-link" href="/resume" target="_blank" rel="noopener noreferrer" onClick={() => trackResumeOpen("navigation")}>Resume</Link></li>}
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
          ref={menuButtonRef}
          onClick={() => mobileMenuSet(!mobileMenuClick)}
          aria-expanded={mobileMenuClick}
          aria-controls="mobile-navigation"
        >
          <span>Menu</span>
        </button>
      </div>
    </m.header>
  );
};

function PortfolioNavigation({ items, activeSectionId }: { items: NavbarItem[]; activeSectionId: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const previousMenu = useRef(false);
  useEffect(() => { if (previousMenu.current!==menuOpen) { trackEvent('navigation_menu',{action:menuOpen?'open':'close',placement:'portfolio'}); previousMenu.current=menuOpen; } },[menuOpen]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("max-jumbo") || document.querySelector<HTMLElement>("[data-navigation-hero]");
    const updateSurface = () => {
      // The cinematic hero stays pinned. Its first viewport is the navigation boundary,
      // rather than its sticky rectangle, which remains onscreen through the whole story.
      const story = hero?.closest<HTMLElement>("[data-navigation-story]");
      const boundary = story && hero
        ? story.getBoundingClientRect().top + hero.offsetHeight
        : hero?.getBoundingClientRect().bottom;
      setOverHero(!menuOpen && boundary !== undefined && boundary > 0);
    };
    const scheduledUpdate = createRafThrottled(updateSurface);
    updateSurface();
    window.addEventListener("scroll", scheduledUpdate, { passive: true });
    window.addEventListener("resize", scheduledUpdate);
    return () => {
      window.removeEventListener("scroll", scheduledUpdate);
      window.removeEventListener("resize", scheduledUpdate);
      scheduledUpdate.cancel();
    };
  }, [router.pathname, menuOpen]);

  const handleSectionLink = (event: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    trackClick(route, "navbar_link");
    if (
      !route.startsWith("/#") ||
      router.pathname === "/" ||
      event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) return;

    event.preventDefault();
    const targetId = route.slice(2);
    void router.push(route).then(() => {
      let attempts = 0;
      const alignWhenReady = () => {
        const target = document.getElementById(targetId);
        if (target) {
          const rootStyle = document.documentElement.style;
          const previousScrollBehavior = rootStyle.scrollBehavior;
          rootStyle.scrollBehavior = "auto";
          target.scrollIntoView({ behavior: "auto", block: "start" });
          requestAnimationFrame(() => { rootStyle.scrollBehavior = previousScrollBehavior; });
        } else if (attempts++ < 120) {
          requestAnimationFrame(alignWhenReady);
        }
      };
      requestAnimationFrame(alignWhenReady);
    });
  };

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpenRef.current) triggerRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className={styles.portfolioNav} data-over-hero={overHero}>
      <Link href="/" className={styles.portfolioBrand} aria-label="Nirmal Khedkar, home">nirmalhk7</Link>
      <nav className={styles.portfolioDesktopNav} aria-label="Main navigation">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.route}
            aria-current={activeSectionId === item.sectionId && item.sectionId ? router.pathname === '/' ? 'location' : 'page' : undefined}
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
          <PortfolioMenuOverlay reduceMotion={Boolean(reduceMotion)}>
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
                <button data-analytics-id="close_navigation_menu" type="button" data-analytics-skip-global="true" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">Close <MenuGlyph open={menuOpen} reduceMotion={Boolean(reduceMotion)} /></button>
              </div>
              <ul>
                {items.map((item, index) => (
                  <m.li key={item.label} variants={{
                    closed: { opacity: 0, y: reduceMotion ? 0 : 8, transition: { duration: 0.1 } },
                    open: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0.1 : 0.3, ease: [0.16, 1, 0.3, 1] } },
                  }}>
                    <Link
                      href={item.route}
                      aria-current={activeSectionId === item.sectionId && item.sectionId ? router.pathname === '/' ? 'location' : 'page' : undefined}
                      data-analytics-skip-global="true"
                      onClick={(event) => { handleSectionLink(event, item.route); setMenuOpen(false); }}
                    >
                      <span className={styles.portfolioMenuIndex}>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span>
                    </Link>
                  </m.li>
                ))}
              </ul>
              <div className={styles.portfolioMenuActions}>
                <Link data-analytics-skip-global="true" href="/resume" onClick={() => { trackResumeOpen("navigation"); setMenuOpen(false); }}>Resume</Link>
                <button data-analytics-id="navbar_control_17" data-analytics-skip-global="true" type="button" onClick={() => { setMenuOpen(false); window.dispatchEvent(new Event("open-command-palette")); }}>Search <kbd>⌘ K</kbd></button>
              </div>
            </m.nav>
          </PortfolioMenuOverlay>
        )}
      </AnimatePresence>
    </header>
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
export default Navbar;
