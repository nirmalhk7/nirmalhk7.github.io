/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
// import { useStaticQuery, graphql } from "gatsby"

import Navbar from "./partials/navbar";
import Footer from "./partials/footer";
import ContactForm from "./partials/contactme";
import RandomQuote from "./partials/quote";
import $ from "jquery";

class Layout extends React.Component {
  componentDidMount() {
    window.onbeforeunload = function () {
      this.window.scrollTo(0, 0);
    };
    var cfg = {
        scrollDuration: 800, // smoothscroll duration
        mailChimpURL: "", // mailchimp url
      },
      $WIN = $(window);

    var toggleButton = $(".header-menu-toggle"),
      nav = $(".header-nav-wrap");

    toggleButton.on("click", function (event) {
      event.preventDefault();

      toggleButton.toggleClass("is-clicked");
      nav.slideToggle();
    });

    if (toggleButton.is(":visible")) nav.addClass("mobile");

    $WIN.on("resize", function () {
      if (toggleButton.is(":visible")) nav.addClass("mobile");
      else nav.removeClass("mobile");
    });

    nav.find("a").on("click", function () {
      if (nav.hasClass("mobile")) {
        toggleButton.toggleClass("is-clicked");
        nav.slideToggle();
      }
    });

    $(".smoothscroll").on("click", function (e) {
      var target = this.hash,
        $target = $(target);

      e.preventDefault();
      e.stopPropagation();

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $target.offset().top,
          },
          cfg.scrollDuration,
          "swing",
          function () {
            window.location.hash = target;
          }
        );
    });

    var hero = $(".page-hero"),
      hdr = $("header"),
      triggerHeight = hero.outerHeight() - 170;

    $WIN.on("scroll", function () {
      var loc = $WIN.scrollTop();

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
    let children = this.props.children;
    return (
      <>
        {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
        <Navbar location={this.props.location} />
        <div>
          <main>{children}</main>
        </div>
        <RandomQuote />
        <ContactForm />
        <Footer />
      </>
    );
  }
}
// const Layout = ({ children }) => {
//   // const data = useStaticQuery(graphql`
//   //   query SiteTitleQuery {
//   //     site {
//   //       siteMetadata {
//   //         title
//   //       }
//   //     }
//   //   }
//   // `)

//   return (

//   )
// }

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
