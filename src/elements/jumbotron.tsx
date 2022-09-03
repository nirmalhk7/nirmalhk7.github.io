import React from "react";
import { Link } from "gatsby";
import SocialMediaIcons from "./social/socialSection";

const Jumbotron = {
  mini: () => <div />,
  Max: ({
    bgImg,
    orangeText,
    HeadingTextComponent,
    buttonDetails,
    showScrollDown,
  }) => (
    <section
      className={`s-home   bg-fixed bg-center bg-no-repeat ${bgImg} bg-cover relative z-10`}
    >
      <div className="z-0 bg-black h-full left-0 opacity-40 absolute top-0 w-full" />
      <div className="home-content  pt-40 z-10">
        <div className="tablet:container mx-auto home-content__main">
          <h3 className="ital-hover">{orangeText}</h3>
          {HeadingTextComponent}
          <div className="static text-left gap-4 right-0 bottom-8  text-button font-blocky uppercase font-bold">
            {buttonDetails &&
              buttonDetails.map((item) => (
                <Link
                  className="inline-block mr-4 border-4 no-underline px-5 text-white border-white hover:bg-white hover:text-black"
                  key={item[0]}
                  to={item[1]}
                >
                  {item[0]}
                </Link>
              ))}
          </div>
          {showScrollDown ? (
            <div className="home-content__scroll">
              <Link
                className="scroll-link no-underline hover:text-white"
                to="#about"
              >
                <span>Scroll Down</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <SocialMediaIcons />
    </section>
  ),
};

export default Jumbotron;