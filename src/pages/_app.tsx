import React from "react";
import dynamic from "next/dynamic";
import { AnalyticsProvider } from "@/components/Analytics/AnalyticsProvider";

import "@/assets/css/tailwind.css";
import "@/assets/css/reveal.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import Navbar from "@/elements/navbar";
import portfolioStyles from "@/components/Home/portfolio.module.css";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { useAnalytics } from "@/hooks/useAnalytics";
import { trackWebVital } from "@/util/analytics";
import { useViewTransitions } from "@/hooks/useViewTransitions";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRouter } from "next/router";
import { openGraphImage } from "@/util/openGraph";

// Dynamic imports for performance
const ScrollToTop = dynamic(() => import("@/elements/scrollToTop"), { ssr: false });
const ContactMeSection = dynamic(() => import("@/components/ContactMe/contactMeSection"));
const FooterSection = dynamic(() => import("@/components/Footer/footerSection"));
const QuoteSection = dynamic(() => import("@/components/Quote/quoteSection"));
const CommandPalette = dynamic(() => import("@/components/UI/CommandPalette"), { ssr: false });
const CursorSpotlight = dynamic(() => import("@/components/UI/CursorSpotlight"), { ssr: false });
const SmoothScroller = dynamic(() => import("@/components/UI/SmoothScroller"), { ssr: false });
const SectionNavigator = dynamic(() => import("@/components/UI/SectionNavigator"), { ssr: false });
const ContactBand = dynamic(() => import("@/components/Site/Editorial").then((module) => module.ContactBand));

config.autoAddCss = false;

export interface DefaultPageProps {
  pageMetadata: {
    enableWrap: boolean,
    layoutVariant?: "default" | "portfolio",
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
  const layoutVariant = pageProps.pageMetadata?.layoutVariant ?? "portfolio";
  const isPortfolio = layoutVariant === "portfolio";
  const isResume = router.pathname === "/resume";

  useAnalytics();

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen">
      {!isPortfolio && <ScrollProgress />}
      {!isPortfolio && <LegacyViewTransition />}
      {!isPortfolio && <ScrollToTop />}
      {!isPortfolio && <SmoothScroller />}
      {!isPortfolio && <SectionNavigator />}
      {!isPortfolio && <CursorSpotlight />}
      {!isResume && <CommandPalette />}
      <DefaultSeo
        defaultTitle="Nirmal Khedkar | Software Engineer"
        description="Nirmal Khedkar builds backend services, infrastructure, and products across the stack."
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://nirmalhk7.com",
          siteName: "Nirmal Khedkar",
          images: [openGraphImage("Built for the real world.", "Product thinking. Engineering depth.", "home")],
        }}
        additionalMetaTags={[
          {
            name: "theme-color",
            content: isPortfolio ? "#f5f2eb" : "#000000",
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
      <AnalyticsProvider hideBanner={isResume} />
      {pageProps.pageMetadata ? (
        <div key="page-content" className={isPortfolio ? portfolioStyles.shell : undefined}>
          {pageProps.pageMetadata.seoMetadata ? (
            <NextSeo {...pageProps.pageMetadata.seoMetadata} />
          ) : null}
          {pageProps.pageMetadata.enableWrap ? <Navbar variant={layoutVariant} /> : null}
          {isPortfolio ? (
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                data-analytics-page={router.asPath.split("?")[0].split("#")[0]}
                key={router.pathname}
                initial={shouldReduceMotion ? { opacity: 0.8 } : { clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0.8 } : { clipPath: "inset(0 100% 0 0)" }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.34, ease: [0.76, 0, 0.24, 1] }}
              >
                <Component {...pageProps} />
                {pageProps.pageMetadata.enableWrap && router.pathname !== "/" ? <ContactBand /> : null}
                {pageProps.pageMetadata.enableWrap ? <FooterSection variant="portfolio" /> : null}
              </m.div>
            </AnimatePresence>
          ) : <AnimatePresence mode="wait">
            <m.div
              data-analytics-page={router.asPath.split("?")[0].split("#")[0]}
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
          </AnimatePresence>}
        </div>
      ) : null}
    </div>
    </LazyMotion>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  trackWebVital(metric);
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return <m.div className="native-scroll-progress fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-white to-accent z-[60] origin-left" style={{ scaleX }} />;
}

function LegacyViewTransition() {
  useViewTransitions();
  return null;
}
