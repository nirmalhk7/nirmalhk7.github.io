import React from "react";

import SocialMediaIcons from "./social/socialSection";
import Link from "next/link";
import Image from "next/image";
import beachImage from "../assets/images/BeachNK_1.jpg";

type MiniProps = {
  backgroundImage: string;
  backgroundImageAlt: string;
  title: string;
  subtitle: string;
  DescriptionComponent: React.ComponentType;
};
type MaxProps = {
  bgImg: string;
  orangeText: string;
  HeadingTextComponent: React.ReactNode;
  buttonDetails: [string, string][];
  showScrollDown?: boolean;
};

const Jumbotron = {
  mini: ({
    backgroundImage,
    backgroundImageAlt,
    title,
    subtitle,
    DescriptionComponent
  }: MiniProps) => (
    <section
      className="page-header bg-fixed bg-center bg-no-repeat selection:bg-accent selection:text-white"
      id={`${title}-header`}
    >
      <Image
        layout="fill"
        className="object-center object-cover pointer-events-none !h2/5"
        src={backgroundImage}
        placeholder="blur"
        alt={backgroundImageAlt}
      />
      <div className="container mx-auto page-header__content">
        <article>
          <h1 className="page-header__title">
            <a href="#0" title={title}>
              {title}
            </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">{subtitle}</div>
          </div>
          <DescriptionComponent />
        </article>
      </div>
    </section>
  ),
  Max: ({
    orangeText,
    HeadingTextComponent,
    buttonDetails
  }: MaxProps) => (

    <section
      className="s-home z-10 py-0 selection:bg-accent selection:text-white"
    >
      <Image
        layout="fill"
        className="object-right object-cover pointer-events-none laptop:object-center !h-screen"
        src={beachImage}
        placeholder="blur"
        alt="Me on the beach"
      />
      <div className="z-0 bg-black h-screen left-0 opacity-50 absolute top-0 w-full" />
      <div className="home-content z-10">
        <div className="tablet:container mx-auto home-content__main">
          <h3 className="ital-hover">{orangeText}</h3>
          {HeadingTextComponent}
          <div className="static text-left gap-4 right-0 bottom-8  text-button font-blocky uppercase font-bold">
            {buttonDetails.map((item) => (
              <Link
                className="my-4 inline-block mr-4 border-4 no-underline px-5 text-white border-white hover:bg-white hover:text-black"
                key={item[0]}
                href={item[1]}
              >
                {item[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <SocialMediaIcons />
    </section>
  ),
};

export default Jumbotron;
