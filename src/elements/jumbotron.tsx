import React from "react";

import SocialMediaIcons from "./social/socialSection";
import Link from "next/link";
import Image from "next/legacy/image";
import beachImage from "../assets/images/BeachNK_1.jpg";

const Jumbotron = {
  mini: ({bgImg, bgImgAlt, title, subtitle, DescriptionComponent}) => (
    <section
      className="page-header  bg-fixed bg-center bg-no-repeat"
      id={`${title}-header`}
    >
      <Image
        layout="fill"
        className="object-center object-cover pointer-events-none"
        src={bgImg}
        placeholder="blur"
        alt={bgImgAlt}
      />
      <div className="container mx-auto page-header__content">
        <article>
          <h1 className="page-header__title">
            <a href="#0" title={title}>
              {title}
            </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">
              {subtitle}
            </div>
          </div>
          <DescriptionComponent />
        </article>
      </div>
    </section>
  ),
  Max: ({
    bgImg,
    orangeText,
    HeadingTextComponent,
    buttonDetails,
    showScrollDown,
  }) => (

    <section
      className={`s-home   bg-fixed bg-center bg-no-repeat bg-cover relative z-10`}
    >
      <Image
        layout="fill"
        
        className="object-center object-cover pointer-events-none"
        src={beachImage}
        placeholder="blur"
        alt="Me on the beack"
      />
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
                  href={item[1]}
                >
                  {item[0]}
                </Link>
              ))}
          </div>
          {showScrollDown ? (
            <div className="home-content__scroll">
              <Link
                className="scroll-link no-underline hover:text-white"
                href="#about"
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
