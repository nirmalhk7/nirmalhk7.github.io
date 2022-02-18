import {
  faAngellist,
  faDev,
  faGithub,
  faGoodreads,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../assets/css/social.module.scss";

// TODO fix colors of social icons
export const social = [
  {
    name: "GitHub",
    link: "https://www.github.com/nirmalhk7",
    class: faGithub,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/nirmalhk7",
    class: faLinkedin,
    underBlog: true,
  },
  {
    name: "Angellist",
    link: "https://angel.co/nirmalhk7",
    class: faAngellist,
  },
  {
    name: "Goodreads",
    link: "https://www.goodreads.com/user/show/93069537-nirmal",
    class: faGoodreads,
  },
  {
    name: "RSS",
    link: "/feed.xml",
    class: faRss,
  },
  {
    name: "DEV",
    link: "https://dev.to/nirmalhk7",
    class: faDev,
  },
];

const SocialMediaIcons = () => {
  return (
    <ul className="bottom-0 font-bold list-none m-0 pb-64 absolute font-blocky right-16">
      {social.map((element, index) => (
        <li key={index}>
          <a className="text-white" href={element.link} title={element.name}>
            <FontAwesomeIcon icon={element.class} />
            <span className="text-accent text-xl leading-10 opacity-0 absolute top-0 invisible right-14">
              {element.name}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};
export default SocialMediaIcons;
