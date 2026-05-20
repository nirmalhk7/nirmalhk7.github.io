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
    brandColor: "#4078c0",
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/nirmalhk7",
    class: faLinkedin,
    underBlog: true,
    brandColor: "#0077b5",
  },
  {
    name: "X",
    link: "https://x.com/nirmalhk7",
    class: faXTwitter,
    underBlog: true,
    brandColor: "#1DA1F2",
  },
  {
    name: "Mastodon",
    link: "https://fosstodon.org/@nirmalhk7",
    class: faMastodon,
    underBlog: true,
    brandColor: "#6364ff",
  },
  {
    name: "Email",
    link: "mailto:nirmalhk7@gmail.com",
    class: faEnvelope,
    brandColor: "#EA4335",
  },
  {
    name: "Goodreads",
    link: "https://www.goodreads.com/user/show/93069537-nirmal",
    class: faGoodreads,
    brandColor: "#75421c",
  },
];

const SocialSection = () => {
  return (
    <ul className="pb-16 font-bold m-0 absolute bottom-0 right-16 font-blocky list-none after:block after:w-px after:bg-white after:bottom-0 after:content-[''] z-20">
      {social.map((element, index) => (
        <li
          className="relative h-20 group"
          key={index}
          style={
            { "--brand-color": element.brandColor } as React.CSSProperties
          }
        >
          <Magnetic>
            <button
              className="border-0 h-full text-3xl align-top flex items-center justify-center text-white/50 hover:text-[var(--brand-color)] transition-all duration-300"
              onClick={() => {
                trackClick(element.name, "social_link");
                window.open(element.link, "_blank", "noopener,noreferrer");
              }}
              title={element.name}
            >
              <FontAwesomeIcon
                icon={element.class}
                className="transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_var(--brand-color)]"
              />
            </button>
          </Magnetic>
        </li>
      ))}
    </ul>
  );
};
export default SocialSection;
