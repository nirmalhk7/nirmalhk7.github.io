import {
  faAngellist,
  faDev,
  faGithub,
  faGoodreads,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faRss } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import "../assets/css/social_module.scss";

// TODO fix colors of social icons
export const social = () => {
  const socialInfo = useStaticQuery(graphql`
    {
      cv: allProfilesYaml {
        nodes {
          name
          url
        }
      }
    }
  `).cv.nodes;
  socialInfo.map((element) => {
    switch (element.name) {
      case "GitHub":
        element.icon = faGithub;
        break;
      case "LinkedIn":
        element.icon = faLinkedin;
        element.underBlog = true;
        break;
      case "Angellist":
        element.icon = faAngellist;
        break;
      case "Goodreads":
        element.icon = faGoodreads;
        break;
      case "RSS":
        element.icon = faRss;
        break;
      case "Email":
        element.icon = faEnvelope;
        break;
      case "DEV":
        element.icon = faDev;
        break;
    }
  });
  return socialInfo;
};

const SocialMediaIcons = () => {
  return (
    <ul className="home-social">
      {social().map((element) => {
        if (element.icon)
          return (
            <li key={element.name}>
              {console.log(social())}
              <a href={element.url} title={element.name}>
                <FontAwesomeIcon icon={element.icon} />
                <span>{element.name}</span>
              </a>
            </li>
          );
      })}
    </ul>
  );
};
export default SocialMediaIcons;
