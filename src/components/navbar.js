import React from "react";
import { Link } from "gatsby";
import Scrollspy from "react-scrollspy";
import "../assets/css/navbar_module.scss";

const Navbar = () => {
  const navbarList = ["Home", "About", "Projects", "Blog", "Contact"];
  return (
    <header className="s-header">
      <Link to="/">
        <div className="header-logo">nirmalhk7</div>
      </Link>
      <nav className="header-nav-wrap">
        <Scrollspy
          className="header-nav"
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
              <li key={index}>
                <Link title={element} to={hrx}>
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
