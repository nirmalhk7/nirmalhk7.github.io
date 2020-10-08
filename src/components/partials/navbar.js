import React from "react";
import { Link } from "gatsby";
import Scrollspy from "react-scrollspy";

const Navbar = (props) => {
  let pathName = document.location.pathname.split("/")[1];
  let navbarList = ["Home", "About", "Projects", "Blog", "Contact"];
  return (
    <header className="s-header">
      <Link to="/">
        <div className="header-logo">nirmalhk7</div>
      </Link>
      <nav className="header-nav-wrap">
        <Scrollspy
          items={navbarList.map((element) => element.toLowerCase())}
          currentClassName="now"
          className="header-nav"
          offset={-100}
        >
          {navbarList.map((element, index) => {
            return (
              <li key={index}>
                <a href={element==="Home"? "/":"/"+element.toLowerCase()} title={element}>
                  {element}
                </a>
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
