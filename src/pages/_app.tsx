import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Libre_Baskerville, Montserrat } from "next/font/google";

import "@/assets/css/tailwind.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps } from "next/app";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/elements/navbar";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import Loader from "@/components/Loader/Loader";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

// Dynamic imports for performance
const ContactMeSection = dynamic(() => import("@/components/ContactMe/contactMeSection"));
const FooterSection = dynamic(() => import("@/components/Footer/footerSection"));
const QuoteSection = dynamic(() => import("@/components/Quote/quoteSection"));

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

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
  const router = useRouter();

  useAnalytics();

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
    <div className={`min-h-screen scroll-smooth ${libreBaskerville.variable} ${montserrat.variable}`}>
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
        canonical="https://nirmalhk7.com"
        additionalMetaTags={[
          {
            name: "robots",
            content: "noai, noimageai",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
          {
            rel: "apple-touch-icon",
            href: "/favicon.ico",
            sizes: "180x180",
          },
          { rel: "me", href: "https://fosstodon.org/@nirmalhk7" },
          {
            rel: "alternate",
            type: "application/rss+xml",
            href: "https://nirmalhk7.com/api/rss",
          },
        ]}
        twitter={{
          cardType: "summary",
          handle: "nirmalhk7",
          site: "https://nirmalhk7.com",
        }}
        titleTemplate="%s | Nirmal Khedkar"
      />
      {process.env.NODE_ENV === "production" && (
        <>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLETAG || ""} />
          <Analytics />
          <SpeedInsights />
        </>
      )}
      {pageProps.pageMetadata ? (
        <div key="page-content">
          {pageProps.pageMetadata.seoMetadata ? (
            <NextSeo {...pageProps.pageMetadata.seoMetadata} />
          ) : null}
          {pageProps.pageMetadata.enableWrap ? <Navbar /> : null}
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Component {...pageProps} />
              {pageProps.pageMetadata.enableWrap ? (
                <>
                  <QuoteSection quote={pageProps.quote} />
                  <ContactMeSection />
                  <FooterSection />
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}
