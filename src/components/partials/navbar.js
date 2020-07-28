import React from "react";

const Navbar = (props) => (
  <header className="s-header">
    <a href="site.url">
      <div className="header-logo" >
        nirmalhk7
      </div>
    </a>
    <nav className="header-nav-wrap">
      <ul className="header-nav">
        <li ><a href="{{ site.url }}" title="Home" className="now">Home</a></li>
        <li><a className="smoothscroll" href="#about" title="About">About</a></li>
        <li><a href="/project" title="Works">Works</a></li>
        <li><a href="/blog/index" title="Blog">Blog</a></li>
        <li><a className="smoothscroll" href="/#works" title="Works">Works</a></li>
        <li><a className="smoothscroll" href="/#blog" title="Blog">Blog</a></li>
        <li><a className="smoothscroll" href="#contact" title="Contact">Contact</a></li>
      </ul >
    </nav >
    <a className="header-menu-toggle" href="#0"><span>Menu</span></a>
  </header >
)
export default Navbar;