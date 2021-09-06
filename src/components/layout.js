import React from "react";
import PropTypes from "prop-types";

import Navbar from "./partials/navbar";
import Footer, { ScrollToTop } from "./partials/footer";
import ContactForm from "./partials/contactme";
import RandomQuote from "./partials/quote";
import jquery from "jquery";

class Layout extends React.Component {
  componentDidMount() {
    window.onload = function () {
      this.window.scrollTo(0, 0);
    };
    window.onbeforeunload = function () {
      this.window.scrollTo(0, 0);
    };
    const cfg = {
        scrollDuration: 800, // smoothscroll duration
        mailChimpURL: "", // mailchimp url
      },
      jqueryWIN = jquery(window);

    const toggleButton = jquery(".header-menu-toggle");
    const nav = jquery(".header-nav-wrap");

    toggleButton.on("click", (event) => {
      event.preventDefault();

      toggleButton.toggleClass("is-clicked");
      nav.slideToggle();
    });

    if (toggleButton.is(":visible")) nav.addClass("mobile");

    jqueryWIN.on("resize", () => {
      if (toggleButton.is(":visible")) nav.addClass("mobile");
      else nav.removeClass("mobile");
    });

    nav.find("a").on("click", () => {
      if (nav.hasClass("mobile")) {
        toggleButton.toggleClass("is-clicked");
        nav.slideToggle();
      }
    });

    jquery(".smoothscroll").on("click", function (event) {
      const target = this.hash;
      const jquerytarget = jquery(target);

      event.preventDefault();
      event.stopPropagation();

      jquery("html, body")
        .stop()
        .animate(
          {
            scrollTop: jquerytarget.offset().top,
          },
          cfg.scrollDuration,
          "swing",
          () => {
            window.location.hash = target;
          }
        );
    });

    const hero = jquery(".page-hero");
    const hdr = jquery("header");
    const triggerHeight = hero.outerHeight() - 170;

    jqueryWIN.on("scroll", () => {
      const loc = jqueryWIN.scrollTop();

      if (loc > triggerHeight) {
        hdr.addClass("sticky");
      } else {
        hdr.removeClass("sticky");
      }

      if (loc > triggerHeight + 20) {
        hdr.addClass("offset");
      } else {
        hdr.removeClass("offset");
      }

      if (loc > triggerHeight + 150) {
        hdr.addClass("scrolling");
      } else {
        hdr.removeClass("scrolling");
      }
    });
  }
  render() {
    const children = this.props.children;
    return (
      <>
        {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
        <Navbar location={this.props.location} />
        <main>{children}</main>
        <RandomQuote />
        <ContactForm />
        <Footer />
        <ScrollToTop />
      </>
    );
  }
}

export const isProduction = process.env.NODE_ENV === "development";
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
