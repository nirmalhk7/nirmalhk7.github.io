import {
  faAngellist,
  faDev,
  faGithub,
  faGoodreads,
  faLinkedin,
  faMastodon,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faRss } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import "./social_module.scss";

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
    name: "Mastodon",
    link: "https://fosstodon.org/@nirmalhk7",
    class: faMastodon,
    underBlog: true
  },
  {
    name: "Email",
    link: "mailto:nirmalhk7@gmail.com",
    class: faEnvelope,
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
  }
];

const SocialSection = () => {
  return (
    <ul className="font-bold m-0 pb-32 absolute bottom-0 right-16 font-blocky list-none	after:block after:w-px after:bg-white after:bottom-0 after:content-[''] z-20">
      {social.map((element, index) => (
        <li className="relative h-16" key={index}>
          <a className="text-white hover:text-accent" href={element.link} title={element.name}  rel="noreferrer"
                  target="_blank">
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
export default SocialSection;
