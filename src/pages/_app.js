import "../assets/css/tailwind.css";
import "../assets/css/animation.css";

import "../assets/css/nirmalhk7.css";
import { useRouter } from 'next/router';
import SearchEnggOp from "../components/seo";
import { useEffect } from "react";
import jquery from "jquery";


// import "../assets/css/base.css";
// import "../assets/css/main.scss";
// import "../assets/css/nirmalhk7.scss";
// import "../assets/css/vendor.scss";

// import "../assets/css/bootstrap-grid.css";
// import "../assets/scss/custom.scss";
// import "../assets/scss/index.scss";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  const router = useRouter();
  useEffect(()=>{
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
        hdr.addClass("1");
      } else {
        hdr.removeClass("1");
      }

      if (loc > triggerHeight + 20) {
        hdr.addClass("2");
      } else {
        hdr.removeClass("2");
      }

      if (loc > triggerHeight + 150) {
        // bg-black opacity-0 fixed top-0 z-50
        hdr.removeClass("bg-transparent absolute");
        hdr.addClass("bg-black fixed");
      } else {
        hdr.removeClass("bg-black fixed");
        hdr.addClass("bg-transparent absolute");
      }
    });
  });

  return <SearchEnggOp title={Component.name}><Component {...pageProps} router={router} /></SearchEnggOp>;
}
