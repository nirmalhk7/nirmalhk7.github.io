import { QuoteInterface } from "@/components/Quote/quoteSection";
import WebSection from "@/elements/WebSection";
import sampleSize from "lodash/sampleSize";
import { GetStaticProps } from "next";
import React from "react";
import loadYaml from "@/util/loadYaml";
import path from "path";

const DesignPage: React.FC = () => {
  return (
    <WebSection className="relative" id="about">
      {[
        "bg-white text-black selection:bg-accent selection:text-white",
        "bg-black text-white selection:bg-accent selection:text-white",
        "bg-accent text-white selection:bg-white selection:text-accent",
      ].map((color) => (
        <div className={`${color} pt-32 pb-32`} key={color}>
          <div className="container mx-auto">
            <h1>Heading One</h1>
            <h2>Heading Two</h2>
            <h3 className="hover:shadow-accent hover:shadow-md">Heading Three</h3>
            <h4>Heading Four</h4>
            <h5>Heading Five</h5>
            <h6>Heading Six</h6>
            <p>Dummy paragraph. New Line</p>
            <hr />
            <code>CODE1</code>
            <code>CODE1</code>
            <code>CODE1</code>
            <a href="#0"> Custom Link One</a>
            <button className="button button-white">Button One</button>
            <button className="button button-accent">Button One</button>
            <button className="button button-accent-fill">Button One</button>
          </div>
        </div>
      ))}
    </WebSection>
  );
};

export default DesignPage;

export const getStaticProps: GetStaticProps = async () => {
  const allQuotesYaml = loadYaml<QuoteInterface[]>(path.join(process.cwd(), "content", "yml", "quotes.yaml"));

  return {
    props: {
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          defaultTitle: "Official Website of Nirmal Khedkar",
          description:
            "Fortress Code Lightning Fast. This is Nirmal Khedkar's Official Website",
        },
      },
    },
  };
};
