import Link from "next/link";
import React from "react";
import Scrollspy from "react-scrollspy";


const Navbar = () => {
  const navbarList = ["Home", "About", "Projects", "Blog", "Contact"];
  return (
    <header className="font-blocky transition duration-200 font-bold text-navbar uppercase  w-full h-navbar bg-transparent z-40 absolute top-0">
      <Link href="/">
        <div className="left-20 inline-block text-white m-0 p-0 absolute">
          nirmalhk7
        </div>
      </Link>
      <nav className="absolute right-20 hidden tablet:block">
        <Scrollspy
          className="inline-block h-16 m-0 list-none text-white"
          currentClassName="text-accent"
          items={navbarList.map((element) => element.toLowerCase())}
          offset={-100}
        >
          {navbarList.map((element, index) => {
            let hrx;
            if (
              element === "Contact" ||
              element === "About" ||
              element === "Home"
            ) {
              hrx = `#${element.toLowerCase()}`;
              if (element === "About" || element === "Home") {
                hrx = `/${hrx}`;
              }
            } else {
              hrx = `/${element.toLowerCase()}`;
            }

            return (
              <li className="text-white  inline-block pl-0 mr-8" key={index}>
                <Link className="hover:text-accent" title={element} href={hrx}>
                  {element}
                </Link>
              </li>
            );
          })}
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
