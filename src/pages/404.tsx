import React from "react";
import WebSection from "@/elements/WebSection";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { sampleSize } from "lodash";


interface NotFoundPageProps extends DefaultPageProps {
}


const NotFoundPage = () => (
  <main>
    <WebSection id="404" className="page-header  bg-fixed bg-center bg-no-repeat bg-f1Car">
      <div className="page-header__content  m-auto">
        <article className="container mx-auto">
          <h1 className="page-header__title">
            <a href="#0" title="404 Not Found">
              404
            </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">Page Not Found</div>
          </div>
        </article>
      </div>
    </WebSection>
    <WebSection id="404-search" className="bg-white pt-16 pb-48">
      <div className="  m-auto">
        <div className="w-full">
          <h6 style={{ textAlign: "center" }}>
            Lost your way? Search what you need here.
          </h6>
          <div className="blog-list block-1-2 block-tab-full">
            <input
              className="w-full"
              id="sampleInput"
              placeholder="Search Here"
              type="text"
            />
          </div>
        </div>
      </div>
    </WebSection>
  </main>
);

export const getStaticProps: GetStaticProps<NotFoundPageProps> = async (context) => {
  const fs = require('fs');
  const path = require('path');
  const yaml = require('js-yaml');
  const quotesPath = path.join(process.cwd(), 'content/yml/quotes.yaml');
  const fileContents = fs.readFileSync(quotesPath, 'utf8');
  const allQuotesYaml: QuoteInterface[] = yaml.load(fileContents);

  return {
    props: {
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Page not Found",
          description: "Its a 404! But lets find you something else interesting.",
        },
      },
    },
  };
};


export default NotFoundPage;
