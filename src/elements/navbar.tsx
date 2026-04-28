import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import { motion, useScroll, useTransform } from "framer-motion";
import { trackClick } from "@/util/analytics";

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuClick, mobileMenuSet] = useState(false);
  const { scrollY } = useScroll();

  // Define transition points: 0 to 300px scroll
  const backdropBlur = useTransform(scrollY, [0, 300], ["blur(0px)", "blur(12px)"]);
  const shadow = useTransform(scrollY, [0, 300], ["none", "0 10px 15px -3px rgb(0 0 0 / 0.1)"]);
  const gradient = useTransform(
    scrollY,
    [0, 300],
    [
      "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(217,56,56,0) 100%)",
      "linear-gradient(to right, rgba(0,0,0,1) 90%, rgba(217,56,56,1) 100%)"
    ]
  );

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

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        backgroundImage: gradient,
        backdropFilter: backdropBlur,
        boxShadow: shadow,
      }}
      className="font-blocky fixed top-0 transition-all duration-100 font-bold text-base leading-[7.2rem] tracking-[0.25rem] uppercase w-full h-navbar z-50 selection:bg-accent selection:text-white text-white"
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
