/* eslint-disable no-constant-condition */
import { faLongArrowAltUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { social } from "../social/social";
import * as styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className={styles.flicker_3}>
        <div className="">
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
                      <FontAwesomeIcon icon={element.class} />
                      <span>{element.name}</span>
                    </a>
                  </li>
                );
            })}
          </ul>
        </div>
      </div>
      <div className="mt-32 text-center">
        <div className="w-full">
          <div>
            <span style={{ color: "#3d3d3d" }}>
              Made with <FontAwesomeIcon icon={faHeart} /> by Nirmal Khedkar
            </span>
            <span style={{ color: "#3d3d3d" }}>
              Last Updated: July 20, 2020
            </span>
          </div>
          <div>
            <span id="justinmaller" style={{ color: "#3d3d3d" }}>
              Image Credits &nbsp;
              <a className="hidelink" href="/" style={{ color: "#3d3d3d" }}>
                Beast Dreams II
              </a>
              &nbsp; by Justin Maller
            </span>
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
export default Footer;
