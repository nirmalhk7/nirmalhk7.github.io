import React from "react";
import { Link } from "gatsby";

const Navbar = (props) => {
  console.log("NAVBARR",props);
  let webPath= props.location!=null ? props.location.pathname : null
  let activeClass;
  return (
    <header className="s-header">
      <Link to="site.url">
        <div className="header-logo" >
          nirmalhk7
      </div>
      </Link>
      <nav className="header-nav-wrap">
        <ul className="header-nav">
          <li ><Link className={`${webPath==='/' ? 'smoothscroll' : ''}  now`} to={webPath==="/"?`#home`:'/'} title="Home">Home</Link></li>
          <li><Link className="smoothscroll" to="#about" title="About">About</Link></li>
          {/* <li><Link to="/project" title="Works">Works</Link></li>
          <li><Link to="/blog" title="Blog">Blog</Link></li> */}
          <li><Link className="smoothscroll" to={webPath==="/"?`#works`:'/project'} title="Works">Works</Link></li>
          <li><Link className="smoothscroll" to={webPath==="/"?`#blog`:'/blog'} title="Blog">Blog</Link></li>
          <li><Link className="smoothscroll" to="#contact" title="Contact">Contact</Link></li>
        </ul >
      </nav >
      <Link className="header-menu-toggle" to="#0"><span>Menu</span></Link>
    </header >
  )
}
export default Navbar;