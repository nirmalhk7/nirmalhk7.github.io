import React, { useState, useEffect } from "react";

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
import Loader from "@/components/Loader/Loader";
import { SpeedInsights } from "@vercel/speed-insights/next"

config.autoAddCss = false;

export interface DefaultPageProps {
  pageMetadata: {
    enableWrap: boolean,
    seoMetadata: NextSeoProps
  }
  quote?: QuoteInterface;
}

interface CustomAppProps extends AppProps {
  pageProps: DefaultPageProps;
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
        setIsFinishing(true);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      <Loader 
        isLoading={isLoading} 
        isFinishing={isFinishing} 
        duration={1000} 
        onComplete={() => setIsLoading(false)} 
      />
      <DefaultSeo
        defaultTitle="Nirmal Khedkar | Official Website"
        description="Fortress Code, Lightning Fast: Hi, I'm Nirmal Khedkar."
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: "https://nirmalhk7.com",
          
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
      <SpeedInsights/>
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
