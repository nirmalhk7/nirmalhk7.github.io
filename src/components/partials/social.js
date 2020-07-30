import React from "react";

let social = [
  {
    "name": "GitHub",
    "link": "https://www.github.com/nirmalhk7",
    "class": "fab fa-github gi"
  },
  {
    "name": "LinkedIn",
    "link": "https://www.linkedin.com/in/nirmalhk7",
    "class": "fab fa-linkedin li"
  },
  {
    "name": "Angellist",
    "link": "https://angel.co/nirmalhk7",
    "class": "fab fa-angellist an"
  },
  {
    "name": "LinkedIn",
    "link": "https://www.goodreads.com/user/show/93069537-nirmal",
    "class": "fab fa-goodreads go"
  },
  {
    "name": "RSS",
    "link": "/feed.xml",
    "class": "fas fa-rss-square srr"
  },
  {
    "name": "DEV",
    "link": "https://dev.to/nirmalhk7",
    "class": "fab fa-dev dev"
  },
]
const SocialMediaIcons = () => {
  return (
    <ul className="home-social">
      {social.map((element, index) =>
        <li key={index}>
          <a title="socialprofile" href={element.link}>
            <i className={element.class} aria-hidden="true"></i>
            <span>{element.name}</span>
          </a>
        </li>
      )}

    </ul>
  )
}
export default SocialMediaIcons;