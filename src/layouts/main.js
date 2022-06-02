import React from "react";
import PropTypes from "prop-types";

import Navbar from "../elements/navbar";
import Footer from "../elements/footer/footer";
import ContactForm from "../elements/contactMe/contactMe";
import RandomQuote from "../elements/quote";
import jquery from "jquery";

class Layout extends React.Component {
  componentDidMount() {
    const hdr = document.querySelector("header");
  
    document.addEventListener("scroll",(event)=>{
      console.log(window.scrollY)
      if (window.scrollY < hdr.offsetHeight + 300) {
        hdr.classList.add("bg-transparent");
        hdr.classList.add("absolute");
        hdr.classList.remove("bg-black");
        hdr.classList.remove("fixed");
      } else {
        hdr.classList.add("bg-black");
        hdr.classList.add("fixed");
        hdr.classList.remove("bg-transparent");
        hdr.classList.remove("absolute");
      }
    });
  }
  render() {
    console.log(`
    .d8888b.                           888    d8b                            888
    d88P  Y88b                          888    Y8P                            888
    888    888                          888                                   888
    888        888d888 .d88b.   .d88b.  888888 888 88888b.   .d88b.  .d8888b  888
    888  88888 888P"  d8P  Y8b d8P  Y8b 888    888 888 "88b d88P"88b 88K      888
    888    888 888    88888888 88888888 888    888 888  888 888  888 "Y8888b. Y8P
    Y88b  d88P 888    Y8b.     Y8b.     Y88b.  888 888  888 Y88b 888      X88  "
     "Y8888P88 888     "Y8888   "Y8888   "Y888 888 888  888  "Y88888  88888P' 888
                                                                 888
                                                            Y8b d88P
                                                             "Y88P"

    Find my resume here: https://nirmalhk7.tech/Resume.pdf`);

    const children = this.props.children;
    return (
      <>
        <Navbar location={this.props.location} />
        <main>{children}</main>
        <RandomQuote />
        <ContactForm />
        <Footer />
      </>
    );
  }
}

export const isProduction = process.env.NODE_ENV === "development";
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
