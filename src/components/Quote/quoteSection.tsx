// import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import WebSection from "@/elements/WebSection";

export interface QuoteInterface {
  content: string;
  saidby: string;
}

const QuoteSection = ({ quote }: { quote?: QuoteInterface }) => {
  if (!quote) return null;
  return (
    <WebSection className="bg-white" id="quote">
      <div className="narrow m-auto text-center text-4xl pb-6 relative selection:bg-accent selection:text-white">
        <div>
          <blockquote>
            <p>{quote.content} </p>
            <cite>{quote.saidby}</cite>
          </blockquote>
        </div>
      </div>
    </WebSection>
  );
};
export default QuoteSection;
