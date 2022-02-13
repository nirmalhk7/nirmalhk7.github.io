import React from "react";
import Scrollspy from "react-scrollspy";
import "../assets/css/navbar.module.scss";
import Link from "./link";

const Navbar = () => {
  const navbarList = ["Home", "About", "Projects", "Blog", "Contact"];
  return (
    <header className="w-100 bg-transparent z-50 absolute top-0" id="tw-header">
      <Link to="/">
        <div
          className="inline-block absolute uppercase left-2 tracking-widest font-bold font-blocky text-white"
          id="tw-header-logo"
        >
          nirmalhk7
        </div>
      </Link>
      <nav className="font-blocky font-bold tracking-widest absolute header-nav-wrap">
        <Scrollspy
          className="inline-block list-none m-0 h-navbar header-nav"
          currentClassName="now"
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
              <li className="inline-block pl-0 mr-8" key={index}>
                <Link
                  className="block h-navbar text-white"
                  title={element}
                  to={hrx}
                >
                  {element}
                </Link>
              </li>
            );
          })}
        </Scrollspy>
      </nav>
      <Link className="header-menu-toggle" to="#0">
        <span>Menu</span>
      </Link>
    </header>
  );
};
export default Navbar;
