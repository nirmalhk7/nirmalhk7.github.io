import React from "react";
import dynamic from "next/dynamic";

import "@/assets/css/tailwind.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps } from "next/app";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/elements/navbar";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnimatePresence, LazyMotion, domAnimation, m, useScroll, useSpring } from "framer-motion";
import { useRouter } from "next/router";

// Dynamic imports for performance
const ScrollToTop = dynamic(() => import("@/elements/scrollToTop"), { ssr: false });
const ContactMeSection = dynamic(() => import("@/components/ContactMe/contactMeSection"));
const FooterSection = dynamic(() => import("@/components/Footer/footerSection"));
const QuoteSection = dynamic(() => import("@/components/Quote/quoteSection"));

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
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useAnalytics();

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen">
      <m.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
        style={{ scaleX }}
      />
      <ScrollToTop />
      <DefaultSeo
        defaultTitle="Nirmal Khedkar | Official Website"
        description="Fortress Code, Lightning Fast: Hi, I'm Nirmal Khedkar."
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: "https://nirmalhk7.com",
          siteName: "Nirmal Khedkar",
          images: [
            {
              url: "https://nirmalhk7.com/assets/images/BeachNK_1.jpg",
              width: 1200,
              height: 630,
              alt: "Nirmal Khedkar",
            },
          ],
        }}
        canonical="https://nirmalhk7.com"
        additionalMetaTags={[
          {
            name: "robots",
            content: "noai, noimageai",
          },
          {
            name: "theme-color",
            content: "#000000",
          },
          {
            name: "msapplication-TileColor",
            content: "#000000",
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
          {
            rel: "manifest",
            href: "/manifest.json",
          },
        ]}
        twitter={{
          cardType: "summary_large_image",
          handle: "@nirmalhk7",
          site: "@nirmalhk7",
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
            <m.div
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
            </m.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
    </LazyMotion>
  );
}
