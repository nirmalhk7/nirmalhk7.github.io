import React from "react";
import loadYaml from "@/util/loadYaml";
import path from "path";
import WebSection from "@/elements/WebSection";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { sampleSize } from "lodash";
import { trackView, trackError } from "@/util/analytics";

interface NotFoundPageProps extends DefaultPageProps {
}


const NotFoundPage = () => {
  React.useEffect(() => {
    trackView("404_page");
    trackError("404 Not Found", false);
  }, []);

  return (
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
  </main>
  );
};

export const getStaticProps: GetStaticProps<NotFoundPageProps> = async () => {
  const quotesPath = path.join(process.cwd(), 'content/yml/quotes.yaml');
  const allQuotesYaml = loadYaml<QuoteInterface[]>(quotesPath);

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
