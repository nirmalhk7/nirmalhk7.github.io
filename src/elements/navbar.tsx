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
      className={`font-blocky transition-all duration-300 font-bold text-base leading-[7.2rem] tracking-[0.25rem] uppercase w-full h-navbar z-50 selection:bg-accent selection:text-white ${
        isScrolled 
          ? "fixed top-0 bg-black text-white shadow-lg" 
          : "absolute top-0 bg-transparent text-white"
      }`}
    >
      <Link
        href="/"
        onClick={() => trackClick("logo", "navbar")}
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
          className="header-nav-wrap__navbar inline-block h-16 m-0 list-none"
          currentClassName="!text-accent"
          items={navbarInternalData.map((element) =>
            element.label.toLowerCase()
          )}
          offset={-100}
        >
          {navbarInternalData.map((element) => (
            <motion.li 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="pl-0 mr-8" 
              key={element.label}
            >
              <Link
                className="hover:text-accent"
                title={element.label}
                href={element.route}
                onClick={() => {
                  trackClick(element.label, "navbar_link");
                  mobileMenuSet(false);
                }}
              >
                {element.label}
              </Link>
            </motion.li>
          ))}
        </Scrollspy>
      </nav>
      <Link
        className={`header-menu-toggle block tablet:hidden ${
          mobileMenuClick ? "is-clicked" : ""
        }`}
        id="nav-button"
        onClick={() => mobileMenuSet(!mobileMenuClick)}
        href="#0"
      >
        <span>Menu</span>
      </Link>
    </motion.header>
  );
};
export default Navbar;
