import React from "react";

import "@/assets/css/tailwind.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps } from "next/app";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import { GoogleAnalytics } from "@next/third-parties/google";
import Navbar from "@/elements/navbar";
import ContactMeSection from "@/components/ContactMe/contactMeSection";
import FooterSection from "@/components/Footer/footerSection";
import QuoteSection, { QuoteInterface } from "@/components/Quote/quoteSection";

config.autoAddCss = false;

export interface DefaultPageProps {
  pageMetadata: {
    enableWrap: boolean,
    seoMetadata: NextSeoProps
  }
  quote: QuoteInterface;
}

interface CustomAppProps extends AppProps {
  pageProps: DefaultPageProps;
}

export default function App({ Component, pageProps }: CustomAppProps) {
  return (
    <>
      <DefaultSeo
        defaultTitle="Nirmal Khedkar | Official Website"
        description="SWE and Cloud enthusiast. Hi, I'm Nirmal Khedkar."
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: "https://nirmalhk7.com",
          siteName: "Official Website of Nirmal Khedkar",
        }}
        additionalLinkTags={[
          { rel: "me", href: "https://fosstodon.org/@nirmalhk7" },
        ]}
        twitter={{
          cardType: "summary",
          handle: "nirmalhk7",
          site: "https://nirmalhk7.com",
        }}
        titleTemplate="%s | Nirmal Khedkar"
      />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLETAG || ""} />
      {pageProps.pageMetadata ? (
        <>
          {pageProps.pageMetadata.seoMetadata ? (
            <NextSeo {...pageProps.pageMetadata.seoMetadata} />
          ) : null}
          {pageProps.pageMetadata.enableWrap ? <Navbar /> : null}
          <Component {...pageProps} />
          {pageProps.pageMetadata.enableWrap ? (
            <>
              <QuoteSection quote={pageProps.quote} />
              <ContactMeSection />
              <FooterSection />
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
