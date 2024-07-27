// import { useStaticQuery, graphql } from "gatsby";
import React, { useState } from "react";

export interface QuoteInterface {
  content: string,
  saidby: string
}

const QuoteSection = ({ quote }: {quote: QuoteInterface}) => {
  if(!quote) return null;
  return (
    <section className="bg-white">
      <div className="narrow m-auto text-center text-h4 pb-6 relative selection:bg-accent selection:text-white">
        <div>
          <blockquote>
            <p>{quote.content} </p>
            <cite>{quote.saidby}</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
export default QuoteSection;
