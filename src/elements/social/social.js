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
import "./social_module.scss";
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
    <ul className="font-bold m-0 pb-64 absolute bottom-0 right-16 font-blocky list-none	after:block after:h-64 after:w-px after:bg-white after:bottom-0 after:content-['']">
      {social.map((element, index) => (
        <li key={index} className="relative h-16">
          <a href={element.link} title={element.name} className="text-white">
            <FontAwesomeIcon icon={element.class} />
            <span className="absolute top-0 leading-10 text-xl opacity-0 invisible text-accent right-14">
              {element.name}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};
export default SocialMediaIcons;
