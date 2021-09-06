import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../assets/css/card.css";
import { social } from "../components/partials/social";
import { Link, graphql } from "gatsby";

const BusinessCard = ({ data }) => {
  const [flipped, flippedControl] = useState(false);
  return (
    <div className="bcard">
      <div className="container">
        <div className={`card ${  flipped ? "flipped" : ""}`} onClick={() => flippedControl(!flipped)}>
          <figure className="front">
            <div className="caption">
              <h2>
                {data.site.siteMetadata.title.split(" ")[0]} <span>{data.site.siteMetadata.title.split(" ")[1]}</span>
              </h2>
              <p>product developer</p>
            </div>
          </figure>

          <figure className="back">
            <div className="caption">
              <div className="text-right" style={{ margin: "0.5em" }}>
                {social.map((element, index) => (
                  <a href={element.link} key={index}>
                    <FontAwesomeIcon className="text-white" icon={element.class} style={{ marginRight: "0.5em" }} />
                  </a>
                ))}
              </div>
              <dl>
                <dt>Email</dt>
                <dd>{data.site.siteMetadata.email}</dd>
                <dt>Web</dt>
                <dd>
                  <Link className="text-white" to="/">
                    {data.site.siteMetadata.url}
                  </Link>
                </dd>
              </dl>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
};

export const postQuery = graphql`
  query xy {
    site {
      siteMetadata {
        title
        url
        email
      }
    }
  }
`;

export default BusinessCard;
