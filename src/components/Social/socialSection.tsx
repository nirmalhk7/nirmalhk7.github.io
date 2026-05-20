import {
  faGithub,
  faGoodreads,
  faLinkedin,
  faMastodon,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { trackClick } from "@/util/analytics";
import Magnetic from "@/components/Magnetic";

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
    name: "X",
    link: "https://x.com/nirmalhk7",
    class: faXTwitter,
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
        <li className="relative h-20 group" key={index}>
          <Magnetic>
            <button
              className="border-0 h-full text-3xl align-top flex items-center justify-end text-white/70 hover:text-white transition-colors duration-300"
              onClick={() => {
                trackClick(element.name, "social_link");
                window.open(element.link, "_blank", "noopener,noreferrer");
              }}
              title={element.name}
            >
              <span className="mr-6 text-xs uppercase tracking-[0.2em] opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none whitespace-nowrap text-accent">
                {element.name}
              </span>
              <FontAwesomeIcon
                icon={element.class}
                className="transition-transform duration-300 group-hover:scale-125"
              />
            </button>
          </Magnetic>
        </li>
      ))}
    </ul>
  );
};
export default SocialSection;
