import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackClick } from "@/util/analytics";

type NavbarItem = {
  label: string;
  route: string;
  sectionId: string;
};

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuClick, mobileMenuSet] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState("");

  const navbarInternalData: NavbarItem[] = React.useMemo(
    () => [
      {
        label: "Home",
        route: "/",
        sectionId: "",
      },
      {
        label: "About",
        route: "/#about",
        sectionId: "about",
      },
      {
        label: "Projects",
        route: router.pathname === "/" ? "/#project" : "/projects",
        sectionId: "project",
      },
      {
        label: "Blog",
        route: router.pathname === "/" ? "/#blog" : "/blog",
        sectionId: "blog",
      },
      {
        label: "Contact",
        route: "#contact",
        sectionId: "contact",
      },
    ],
    [router.pathname]
  );
  const activeIndex = navbarInternalData.findIndex((item) => item.sectionId === activeSectionId);
  const highlightedIndex = hoveredIndex ?? activeIndex;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    trackClick(route, "navbar_link");
    mobileMenuSet(false);

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
    const handleScroll = () => {
      const hero = document.getElementById("max-jumbo") || document.getElementById("hero-header") || document.querySelector(".page-header");
      const heroHeight = hero ? (hero as HTMLElement).offsetHeight : window.innerHeight;
      
      if (window.scrollY >= heroHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
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
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [router.pathname, navbarInternalData]);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
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
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="header-nav-wrap fixed inset-0 w-full h-screen bg-black p-10 tablet:hidden"
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
                    onClick={(e) => handleLinkClick(e, element.route)}
                  >
                    {element.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <Link
        href="/"
        onClick={(e) => handleLinkClick(e, "/")}
        className={`text-white no-underline left-20 inline-block m-0 p-0 absolute hover:text-accent ${
          mobileMenuClick ? "opacity-0 invisible" : "opacity-100 visible"
        }`}
      >
        nirmalhk7
      </Link>

      <nav className="header-nav-wrap absolute right-20 hidden tablet:block">
        <ul className="header-nav-wrap__navbar inline-block h-16 m-0 list-none">
          {navbarInternalData.map((element, index) => (
            <motion.li 
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
                onClick={(e) => handleLinkClick(e, element.route)}
              >
                {element.label}
              </Link>
              {highlightedIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-x-[-12px] inset-y-[-4px] bg-accent/20 rounded-lg z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="absolute right-10 top-0 h-full flex items-center tablet:hidden z-[60]">
        <Link
          className={`header-menu-toggle !static !block ${
            mobileMenuClick ? "is-clicked" : ""
          }`}
          id="nav-button"
          onClick={() => mobileMenuSet(!mobileMenuClick)}
          href="#0"
        >
          <span>Menu</span>
        </Link>
      </div>
    </motion.header>
  );
};
export default Navbar;
