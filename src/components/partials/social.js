import { faAngellist, faDev, faGithub, faGoodreads, faLinkedin, faPinterest } from "@fortawesome/free-brands-svg-icons";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// TODO fix colors of social icons
export let social = [
  {
    name: "GitHub",
    link: "https://www.github.com/nirmalhk7",
    class: faGithub,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/nirmalhk7",
    class: faLinkedin,
    underBlog: true
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
  {
    name: "Pinterest",
    class: faPinterest,
    shareLink: "http://pinterest.com/pin/create/bookmarklet/?url=http://www.islandcompany.com/<?= $product->url; ?>&is_video=false&description=<?= $product->meta_description; ?>"
  }
];
const SocialMediaIcons = () => {
  return (
    <ul className="home-social">
      {social.map((element, index) => (
        <li key={index}>
          <a title={`icon-${element.name} socialprofile`} href="#">
            <FontAwesomeIcon icon={element.class} />
            <span>{element.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};
export default SocialMediaIcons;
