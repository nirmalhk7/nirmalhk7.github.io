import React from "react";
import { Link } from "gatsby";

const Navbar = (props) => {
  let webPath = props.location != null ? props.location.pathname : null;
  // TODO Scrollspy for Navbar
  return (
    <header className="s-header">
      <Link to="/">
        <div className="header-logo">nirmalhk7</div>
      </Link>
      <nav className="header-nav-wrap">
        <ul className="header-nav">
          <li>
            <Link
              className={`${webPath === "/" ? "smoothscroll" : ""}  now`}
              to={webPath === "/" ? `#home` : "/"}
              title="Home"
            >
              Home
            </Link>
          </li>
          <li>
            <Link className="smoothscroll" to="#about" title="About">
              About
            </Link>
          </li>
          <li>
            <Link className="smoothscroll" to={webPath === "/" ? `#projects` : "/projects"} title="Projects">
              Projects
            </Link>
          </li>
          <li>
            <Link className="smoothscroll" to={webPath === "/" ? `#blog` : "/blog"} title="Blog">
              Blog
            </Link>
          </li>
          <li>
            <Link className="smoothscroll" to="#contact" title="Contact">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <Link className="header-menu-toggle" to="#0">
        <span>Menu</span>
      </Link>
    </header>
  );
};
export default Navbar;
