/* eslint-disable no-constant-condition */
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { social } from "@/components/Social/socialSection";

const FooterSection = () => {
  return (
    <footer className="selection:bg-accent selection:text-white">
      {process.env.NEXT_PUBLIC ? <div className="">
        <div className="mb-32">
          <ul className="list-none mt-12 ml-0 font-blocky font-normal text-[1.3rem] uppercase tracking-[0.3rem] no-underline">
            {social.map((element, index) => {
              if (element.link)
                return (
                  <li key={index}>
                    <a
                      className="no-underline	hover:text-accent"
                      href={element.link}
                      target="blank"
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
      <div className="text-center">
        <div className="w-full text-neutral-700">
          <div className="font-bold">
            <span>
              Built Bengaluru Tough by Nirmal Khedkar <FontAwesomeIcon icon={faHeart} size="xs" />  
            </span>
          </div>
          <div>
            <span>
              Web theme heavily modified from &nbsp;
              <a
                href="https://www.styleshout.com/"
                className="text-neutral-700"
              >
                styleshout
              </a>
              &nbsp;(Copyright Hola 2017)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterSection;
