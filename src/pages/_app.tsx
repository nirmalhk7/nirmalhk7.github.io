import React from "react";
import dynamic from "next/dynamic";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Montserrat, Libre_Baskerville } from "next/font/google";

import "@/assets/css/tailwind.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/elements/navbar";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useAnalytics } from "@/hooks/useAnalytics";
import { useViewTransitions } from "@/hooks/useViewTransitions";
import { trackWebVital } from "@/util/analytics";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRouter } from "next/router";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

// Dynamic imports for performance
const ScrollToTop = dynamic(() => import("@/elements/scrollToTop"), { ssr: false });
const ContactMeSection = dynamic(() => import("@/components/ContactMe/contactMeSection"));
const FooterSection = dynamic(() => import("@/components/Footer/footerSection"));
const QuoteSection = dynamic(() => import("@/components/Quote/quoteSection"));
const CommandPalette = dynamic(() => import("@/components/UI/CommandPalette"), { ssr: false });
const CursorSpotlight = dynamic(() => import("@/components/UI/CursorSpotlight"), { ssr: false });
const SmoothScroller = dynamic(() => import("@/components/UI/SmoothScroller"), { ssr: false });
const SectionNavigator = dynamic(() => import("@/components/UI/SectionNavigator"), { ssr: false });

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
  const shouldReduceMotion = useReducedMotion();
  const gaId = process.env.NEXT_PUBLIC_GOOGLETAG || "";
  const hasGa = process.env.NODE_ENV === "production" && gaId.length > 0;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useAnalytics();
  useViewTransitions();

  return (
    <LazyMotion features={domAnimation}>
    <div className={`${montserrat.variable} ${libreBaskerville.variable} min-h-screen`}>
      <m.div
        className="native-scroll-progress fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-white to-accent z-[60] origin-left"
        style={{ scaleX }}
      />
      <ScrollToTop />
      <SmoothScroller />
      <SectionNavigator />
      <CursorSpotlight />
      <CommandPalette />
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
      {hasGa && gaId && (
        <>
          <GoogleAnalytics gaId={gaId} />
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
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.985, filter: "blur(8px)" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 1.015, filter: "blur(8px)" }}
              transition={{ duration: shouldReduceMotion ? 0.18 : 0.48, ease: [0.22, 1, 0.36, 1] }}
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

export function reportWebVitals(metric: NextWebVitalsMetric) {
  trackWebVital(metric);
}
