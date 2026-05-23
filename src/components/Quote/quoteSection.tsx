// import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import WebSection from "@/elements/WebSection";
import { SectionReveal } from "@/components/UI/SectionReveal";

export interface QuoteInterface {
  content: string;
  saidby: string;
}

const QuoteSection = React.forwardRef<HTMLElement, { quote?: QuoteInterface }>(({ quote }, ref) => {
  if (!quote) return null;
  return (
    <WebSection className="bg-white" id="quote" ref={ref}>
      <div className="narrow m-auto text-center text-4xl pb-6 relative selection:bg-accent selection:text-white">
        <SectionReveal y={16}>
          <blockquote>
            <p>{quote.content} </p>
            <cite>{quote.saidby}</cite>
          </blockquote>
        </SectionReveal>
      </div>
    </WebSection>
  );
});

QuoteSection.displayName = "QuoteSection";
export default QuoteSection;
