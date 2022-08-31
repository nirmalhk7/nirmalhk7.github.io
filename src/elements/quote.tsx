import { useStaticQuery, graphql } from "gatsby";
import React, { useState } from "react";
import sampleSize from "lodash/sampleSize";

const RandomQuote = () => {
  const [state, setState] = useState(
    sampleSize(
      useStaticQuery(graphql`
        query MyQuery {
          data: allQuotesYaml {
            nodes {
              saidby
              content
            }
          }
        }
      `).data.nodes,
      1
    )[0]
  );
  return (
    <section className="bg-white">
      <div className="narrow m-auto text-center text-h4 pb-6 relative">
        <div>
          <blockquote>
            <p>{state.content} </p>
            <cite>{state.saidby}</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
export default RandomQuote;
