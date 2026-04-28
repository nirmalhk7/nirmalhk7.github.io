import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Scrollspy from "react-scrollspy";
import { motion } from "framer-motion";
import { trackClick } from "@/util/analytics";

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuClick, mobileMenuSet] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navbarInternalData = [
    {
      label: "Home",
      route: "/",
    },
    {
      label: "About",
      route: "/#about",
    },
    {
      label: "Projects",
      route: router.pathname === "/" ? "/#project" : "/projects",
    },
    {
      label: "Blog",
      route: router.pathname === "/" ? "/#blog" : "/blog",
    },
    {
      label: "Contact",
      route: "#contact",
    },
  ].filter((i) => i);

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

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
      }}
      className={`font-blocky transition-all duration-300 font-bold text-base leading-[7.2rem] tracking-[0.25rem] uppercase w-full h-navbar z-50 selection:bg-accent selection:text-white ${
        isScrolled 
          ? "fixed top-0 bg-black/80 text-white shadow-lg" 
          : "absolute top-0 bg-transparent text-white"
      }`}
    >
      <Link
        href="/"
        onClick={(e) => handleLinkClick(e, "/")}
        className="text-white no-underline left-20 inline-block m-0 p-0 absolute hover:text-accent"
      >
        nirmalhk7
      </Link>
      <nav
        className={`header-nav-wrap absolute right-20 tablet:block tablet:transition-all ${
          !mobileMenuClick ? "hidden" : ""
        }`}
      >
        <Scrollspy
          className="header-nav-wrap__navbar inline-block h-16 m-0 list-none tablet:mt-0 mt-20"
          currentClassName="!text-accent"
          items={navbarInternalData.map((element) =>
            element.label.toLowerCase()
          )}
          offset={-100}
        >
          {navbarInternalData.map((element, index) => (
            <motion.li 
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="pl-0 mr-8 relative group" 
              key={element.label}
            >
              <Link
                className="hover:text-accent relative z-10 transition-colors"
                title={element.label}
                href={element.route}
                onClick={(e) => handleLinkClick(e, element.route)}
              >
                {element.label}
              </Link>
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-x-[-12px] inset-y-[-4px] bg-accent/20 rounded-lg z-0 hidden tablet:block"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </motion.li>
          ))}
        </Scrollspy>
      </nav>
      <div className="absolute right-10 top-0 h-full flex items-center tablet:hidden">
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
