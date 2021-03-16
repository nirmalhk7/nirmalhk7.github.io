import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import React, { useState } from "react";
import "../assets/css/card.css";
import { social } from "../components/partials/social";
import { graphql } from 'gatsby'

const BusinessCard = ({ data }) => {
  const [flipped, flippedControl] = useState(false);
  return (
    <div className="bcard">
      <div class="container">
        <div class={"card " + (flipped ? "flipped" : "")} onClick={() => flippedControl(!flipped)}>
          <figure class="front">
            <div class="caption">
              <h2>
                {data.site.siteMetadata.title.split(" ")[0]} <span>{data.site.siteMetadata.title.split(" ")[1]}</span>
              </h2>
              <p>product developer</p>
            </div>
          </figure>

          <figure class="back">
            <div class="caption">
              <div style={{ margin: "0.5em" }} className="text-right">
                {social.map((element, index) => (
                  <a href={element.link}>
                    <FontAwesomeIcon className="text-white" style={{ marginRight: "0.5em" }} icon={element.class} />
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
