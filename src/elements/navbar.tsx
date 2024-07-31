import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useState } from "react";
import Scrollspy from "react-scrollspy";


const Navbar = () => {
  const router = useRouter();
  const [mobileMenuClick,mobileMenuSet]=useState(false)
  const navbarInternalData = [{
    label: "Home",
    route: "/",
    lean: false
  }, {
    label: "About",
    route: "/#about",
    lean: false
  }, {
    label: "Projects",
    route: router.pathname === "/" ? "/#project" : "/projects",
    lean: false
  }, {
    label: "Blog",
    route: router.pathname === "/" ? "/#blog" : "/blog",
    lean: false
  }
    , {
    label: "Contact",
    route: "#contact",
    lean: false
  }
  ].filter(i => i)

  const navbarExternalData = [{
    label: "Blog",
    route: "https://linkedin.com/in/nirmalhk7",
    lean: true
  }]
  const checkIfValid = (flag: boolean) => String(flag) === process.env.NEXT_PUBLIC_LEANMODE;

  return (
    <header className="font-blocky transition duration-500 font-bold text-navbar uppercase w-full h-navbar bg-transparent z-40 absolute top-0 selection:bg-accent selection:text-white">
      <Link href="/">
        <div className="left-20 inline-block text-white m-0 p-0 absolute hover:text-accent transition duration-500">
          nirmalhk7
        </div>
      </Link>
      <nav className={`header-nav-wrap absolute right-20 tablet:block tablet:transition-all duration-500 ${!mobileMenuClick?'hidden':''}`}>
        <Scrollspy
          className="inline-block h-16 m-0 list-none text-white"
          currentClassName="text-accent"
          items={navbarInternalData.map((element) => element.label.toLowerCase())}
          offset={-100}
        >
          {navbarInternalData.filter(i => checkIfValid(i.lean)).map((element) =>
            <li className="text-white inline-block pl-0 mr-8" key={element.label}>
              <Link className="hover:text-accent" title={element.label} href={element.route}>
                {element.label}
              </Link>
            </li>)}
          {navbarExternalData.filter(i => checkIfValid(i.lean)).map((element) =>
            <li className="text-white inline-block pl-0 mr-8" key={element.label}>
              <a rel="noreferrer" target="_blank" className="hover:text-accent" title={element.label} href={element.route}>
                {element.label}
              </a>
            </li>)}
        </Scrollspy>
      </nav>
      <Link
        className={`header-menu-toggle block tablet:hidden ${mobileMenuClick ? 'is-clicked': ''}`}
        id="nav-button"
        onClick={()=>mobileMenuSet(!mobileMenuClick)}
        href="#0"
      >
        <span>Menu</span>
      </Link>
    </header>
  );
};
export default Navbar;
