import React from "react";
import SocialMediaIcons from "./social";

export const MegaJumbotron = ({
  id,
  miniHeader,
  header,
  buttonsSection,
  scrollSection,
  infoSection,
}) => {
  return (
    <section
      className="s-home page-hero  parallax bootstrap-wrapper"
      data-natural-height="2000"
      data-natural-width="3000"
      data-parallax="scroll"
      data-position-y="center"
      id={id}
    >
      <div className="overlay" />
      <div className="home-content ">
        <div className="container home-content__main">
          <h3 className="ital-hover">{miniHeader}</h3>
          <h1>{header}</h1>
          {infoSection ? (
            <div className="page-header__info">{infoSection}</div>
          ) : null}
          {buttonsSection ? (
            <div className="home-content__buttons">{buttonsSection}</div>
          ) : null}
          {scrollSection ? (
            <div className="home-content__scroll">{scrollSection}</div>
          ) : null}
        </div>
      </div>
      <SocialMediaIcons />
    </section>
  );
};
