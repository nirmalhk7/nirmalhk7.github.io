/* eslint-disable no-constant-condition */
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { m } from "framer-motion";

import { social } from "@/components/Social/socialSection";
import { trackClick, trackSelectContent } from "@/util/analytics";
import styles from "@/components/Home/portfolio.module.scss";

const gitCommitSha = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA;

type FooterSectionProps = { variant?: "default" | "portfolio" };

const FooterSection = React.forwardRef<HTMLElement, FooterSectionProps>(({ variant = "default" }, ref) => {
  const isPortfolio = variant === "portfolio";
  return (
    <m.footer 
      ref={ref}
      initial={isPortfolio ? false : { opacity: 0, y: 20 }}
      whileInView={isPortfolio ? undefined : { opacity: 1, y: 0 }}
      viewport={isPortfolio ? undefined : { once: true }}
      transition={isPortfolio ? undefined : { duration: 0.8, ease: "easeOut" }}
      className={`${isPortfolio ? styles.portfolioFooter : ""} selection:bg-accent selection:text-white pb-12`}
    >
      {isPortfolio || process.env.NEXT_PUBLIC ? <div className="container mx-auto">
        <div className="my-16">
          <ul className="list-none m-0 p-0 flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-blocky font-medium text-xl uppercase tracking-[0.25rem]">
            {social.map((element, index) => {
              if (element.link)
                return (
                  <li key={index}>
                    <a
                      className="no-underline flex items-center gap-2 text-neutral-400 hover:text-accent transition-colors"
                      href={element.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics-skip-global="true"
                      onClick={() => {
                        trackSelectContent("footer_social_profile", element.name, {
                          link_url: element.link,
                        });
                        trackClick(element.name, "footer_social_link");
                      }}
                    >
                      <FontAwesomeIcon icon={element.class} size="sm" />
                      <span>{element.name}</span>
                    </a>
                  </li>
                );
            })}
          </ul>
        </div>
      </div> : null}
      <div className="text-center container mx-auto">
        <div className="w-full text-neutral-400 text-lg sm:text-xl">
          <div className="font-bold mb-2">
            <span>
              Built Bengaluru Tough by Nirmal Khedkar <FontAwesomeIcon icon={faHeart} className="text-accent" size="xs" />  
            </span>
          </div>
          <div>
            <span>
              Web theme heavily modified from &nbsp;
              <a
                href="https://www.styleshout.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent transition-colors underline"
              >
                styleshout
              </a>
              &nbsp;(Copyright Hola 2017{gitCommitSha ? `, ${gitCommitSha}` : ""})
            </span>
          </div>
        </div>
      </div>
    </m.footer>
  );
});

FooterSection.displayName = "FooterSection";
export default FooterSection;
