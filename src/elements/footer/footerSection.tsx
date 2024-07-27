/* eslint-disable no-constant-condition */
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { social } from "../social/socialSection";
import * as styles from "./footer.module.css";

const FooterSection = () => {
  return (
    <footer className="selection:bg-accent selection:text-white">
      {process.env.NEXT_PUBLIC ? <div className={styles.flicker_3}>
        <div className="mb-32">
          <ul className={styles.footer_social}>
            {social.map((element, index) => {
              if (element.link)
                return (
                  <li key={index}>
                    <a
                      className="no-underline	hover:text-accent"
                      href={element.link}
                      target="blank"
                    >
                      {/* TODO Increase Icon size in Mobile view */}
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
        <div className="w-full">
          <div className="font-bold">
            <span style={{ color: "#3d3d3d" }}>
              Built Bengaluru Tough by Nirmal Khedkar <FontAwesomeIcon icon={faHeart} size="xs" />  
            </span>
          </div>
          <div>
            <span style={{ color: "#3d3d3d" }}>
              Website theme heavily modified from &nbsp;
              <a
                className="hidelink"
                href="https://www.styleshout.com/"
                style={{ color: "#3d3d3d" }}
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
