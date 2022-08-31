import React from "react";
import { Link } from "gatsby";
import SocialMediaIcons from "./social/social";

const Jumbotron = {
<<<<<<< Updated upstream
  mini: () => <div />,
  Max: ({
=======
  miniCenter: ({ bgImage, categories, title, byLine, sectionClassName }) =>
    <div
      className={`page-header pt-64 pb-32 text-center  bg-fixed bg-center bg-no-repeat ${sectionClassName}`}
      style={{
        backgroundImage: bgImage,
        backgroundSize: "cover",
      }}
    >
      <div className="m-auto page-header__content narrow">
        <article className="w-full">
          <div className="page-header__info">
            <div className="page-header__cat">
              {categories}
            </div>
          </div>
          <h1 className="page-header__title">
            <a href="#0" title="">
              {title}
            </a>
          </h1>
          <ul className="page-header__meta">
            <li className="date">
              {byLine}
            </li>
          </ul>
        </article>
      </div>
    </div>,
  mini: () => <section
    className="page-header  bg-fixed bg-center bg-no-repeat bg-nasaEarth"
  >
    <div className="container mx-auto page-header__content">
      <article>
        <h1 className="page-header__title">
          <a href="#0" title="Projects">
            Projects
          </a>
        </h1>
        <div className="page-header__info">
          <div className="page-header__cat">
            Projects Catalogue of Nirmal Khedkar
          </div>
        </div>
        <p className="narrow">
          I&apos;m a fullstack and hybrid product developer, currently
          understanding and exploring cloud platforms. I love building stuff!{" "}
          <FontAwesomeIcon className="ml-2 text-accent" icon={faWrench} />
        </p>
      </article>
    </div>
  </section>,
  fullHeight: ({
>>>>>>> Stashed changes
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
