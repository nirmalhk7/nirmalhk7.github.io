import React from "react";

import Navbar from "../elements/navbar";
import Footer from "../elements/footer/footerSection";
import ContactForm from "../elements/contactMe/contactMeSection";
import RandomQuote, { QuoteInterface } from "../elements/quoteSection";
import Utils from "../elements/utils";
import { NextSeo, NextSeoProps } from "next-seo";

interface MainLayoutPropsInterface {
  location: string,
  children: any,
  quote: QuoteInterface,
  metadata?: NextSeoProps
}

class MainLayout extends React.Component<MainLayoutPropsInterface> {

  componentDidMount() {
    const hdr = document.querySelector("header");
    const tbtn = document.getElementById("nav-button");

    const handleScroll = () => {
      if (window.scrollY < hdr.offsetHeight + 300) {
        hdr.classList.add("bg-transparent", "absolute");
        hdr.classList.remove("bg-black", "fixed");
      } else {
        hdr.classList.add("bg-black", "fixed");
        hdr.classList.remove("bg-transparent", "absolute");
      }
    };

    document.addEventListener("scroll", handleScroll);

    tbtn.onclick((event) => {
      event.preventDefault();
      tbtn.classList.toggle("is-clicked");
      Utils.slideToggle(tbtn);
    });
  }
  render() {
    // console.log(`
    // .d8888b.                           888    d8b                            888
    // d88P  Y88b                          888    Y8P                            888
    // 888    888                          888                                   888
    // 888        888d888 .d88b.   .d88b.  888888 888 88888b.   .d88b.  .d8888b  888
    // 888  88888 888P"  d8P  Y8b d8P  Y8b 888    888 888 "88b d88P"88b 88K      888
    // 888    888 888    88888888 88888888 888    888 888  888 888  888 "Y8888b. Y8P
    // Y88b  d88P 888    Y8b.     Y8b.     Y88b.  888 888  888 Y88b 888      X88  "
    //  "Y8888P88 888     "Y8888   "Y8888   "Y888 888 888  888  "Y88888  88888P' 888
    //                                                              888
    //                                                         Y8b d88P
    //                                                          "Y88P"

    // Find my resume here: https://nirmalhk7.com/Resume.pdf`);

    return (
      <>
        <NextSeo {...this.props.metadata} />
        <Navbar />
        <main>{this.props.children}</main>
        {!process.env.NEXT_PUBLIC_LEANMODE ? <>
        <RandomQuote quote={this.props.quote} />
          <ContactForm /></> : null}
        <Footer />
      </>
    );
  }
}

export const isProduction = process.env.NODE_ENV === "development";
export default MainLayout;
