import {
  faGithub,
  faGoodreads,
  faLinkedin,
  faMastodon,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import "./social_module.scss";

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
    underBlog: true,
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
];

const SocialSection = () => {
  return (
    <ul className="pb-16 font-bold m-0 absolute bottom-0 right-16 font-blocky list-none after:block after:w-px after:bg-white after:bottom-0 after:content-[''] z-20">
      {social.map((element, index) => (
        <li className="relative h-24" key={index}>
          <button
            className="button-white border-0 h-full text-3xl align-top"
            onClick={() =>
              window.open(element.link, "_blank", "noopener,noreferrer")
            }
            title={element.name}
          >
            <FontAwesomeIcon icon={element.class} />
          </button>
        </li>
      ))}
    </ul>
  );
};
export default SocialSection;
