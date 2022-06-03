import React from "react";
import { graphql, Link } from "gatsby";
import SocialMediaIcons from "./social/social";

const Jumbotron = {
    mini: () => <></>,
    fullHeight: ({ bgImg, orangeText, HeadingTextComponent, buttonDetails, showScrollDown }) => (
        <section
            className={`s-home page-hero  bg-fixed bg-center bg-no-repeat ${bgImg} bg-cover opacity-50`}
        >
            <div className="home-content  py-40 z-10">
                <div className="container mx-auto home-content__main">
                    <h3 className="ital-hover">{orangeText}</h3>
                    {HeadingTextComponent}
                    <div className="static text-left gap-4 right-0 bottom-8  text-button font-blocky uppercase font-bold">
                        {buttonDetails && buttonDetails.map(((item, keys) => (
                            <Link
                                className="inline-block mr-4 border-4 no-underline px-5 text-white border-white hover:bg-white hover:text-black"
                                to={item[1]}
                            >
                                {item[0]}
                            </Link>
                        )))}
                    </div>
                    {showScrollDown ? <div className="home-content__scroll">
                        <Link
                            className="scroll-link no-underline hover:text-white"
                            to="#about"
                        >
                            <span>Scroll Down</span>
                        </Link>
                    </div> : null}
                </div>
            </div>
            <SocialMediaIcons />
        </section>
    )
}

export default Jumbotron;