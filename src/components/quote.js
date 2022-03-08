import { graphql, useStaticQuery } from "gatsby";
import React from "react";

const RandomQuote = () => {
  let { quotes } = useStaticQuery(graphql`
    {
      quotes: allQuotesYaml {
        nodes {
          saidby
          content
        }
      }
    }
  `);
  quotes = quotes.nodes[Math.floor(Math.random() * quotes.nodes.length)];
  
  return (
    <section className="bg-white">
      <div className="narrow section-intro has-bottom-sep m-auto">
        <div className="row">
          <blockquote>
            <p>{quotes.content}</p>
            <cite>{quotes.saidby}</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
export default RandomQuote;
