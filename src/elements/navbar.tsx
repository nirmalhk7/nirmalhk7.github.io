import Link from "next/link";
import { Router, useRouter } from "next/router";
import React from "react";
import Scrollspy from "react-scrollspy";


const Navbar = () => {
  const router = useRouter();
  const navbarData = [{
    label: "Home",
    route: "/"
  }, {
    label: "About",
    route: "/#about"
  }, {
    label: "Projects",
    route: router.pathname === "/" ? "/#project" : "/projects"
  }, {
    label: "Blog",
    route: router.pathname === "/" ? "/#blog" : "/blog"
  }, {
    label: "Contact",
    route: "#contact"
  }]

  return (
    <header className="font-blocky transition duration-200 font-bold text-navbar uppercase w-full h-navbar bg-transparent z-40 absolute top-0">
      <Link href="/">
        <div className="left-20 inline-block text-white m-0 p-0 absolute">
          nirmalhk7
        </div>
      </Link>
      <nav className="absolute right-20 hidden tablet:block">
        <Scrollspy
          className="inline-block h-16 m-0 list-none text-white"
          currentClassName="text-accent"
          items={navbarData.map((element) => element.label.toLowerCase())}
          offset={-100}
        >
          {navbarData.map((element) =>
            <li className="text-white inline-block pl-0 mr-8" key={element.label}>
              <Link className="hover:text-accent" title={element.label} href={element.route}>
                {element.label}
              </Link>
            </li>)}
        </Scrollspy>
      </nav>
      <Link
        className="header-menu-toggle block tablet:hidden"
        id="nav-button"
        href="#0"
      >
        <span>Menu</span>
      </Link>
    </header>
  );
};
export default Navbar;
