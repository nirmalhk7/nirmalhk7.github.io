import React, { useState, useEffect } from "react";

import "@/assets/css/tailwind.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps } from "next/app";
import { DefaultSeo, NextSeo, NextSeoProps, WebSiteJsonLd } from "next-seo";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/elements/navbar";
import ContactMeSection from "@/components/ContactMe/contactMeSection";
import FooterSection from "@/components/Footer/footerSection";
import QuoteSection, { QuoteInterface } from "@/components/Quote/quoteSection";
import Loader from "@/components/Loader/Loader";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { trackClick, trackScrollDepth, trackError, setUserProperty, trackTiming } from "@/util/analytics";
import throttle from "lodash/throttle";

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

  useEffect(() => {
    // Session timing
    const startTime = Date.now();
    
    // Scroll depth tracking
    const trackedMilestones = new Set<number>();
    const handleScroll = throttle(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      [25, 50, 75, 90].forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedMilestones.has(milestone)) {
          trackScrollDepth(milestone);
          trackedMilestones.add(milestone);
          
          // Persona tagging
          if (milestone === 75) setUserProperty("persona", "engaged_reader");
        }
      });
    }, 500);

    // Global outbound link tracking
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        if (url.origin !== window.location.origin && !url.href.startsWith("mailto:")) {
          trackClick(anchor.href, "outbound_link");
          
          // Timing surveillance
          const timeSinceLoad = Date.now() - startTime;
          trackTiming("outbound_click_latency", timeSinceLoad, "engagement");
        }
        
        // Resume tracking
        if (anchor.href.includes("Resume.pdf")) {
          setUserProperty("persona", "recruiter");
          trackClick("resume_download", "action");
        }
      }
    };

    // Error surveillance
    const handleGlobalError = (event: ErrorEvent) => {
      trackError(event.message, false);
    };

    // Visibility surveillance
    const handleVisibilityChange = () => {
      const state = document.visibilityState;
      trackClick(state, "visibility_change");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("error", handleGlobalError);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("error", handleGlobalError);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Track total session time on unmount (best effort)
      const sessionTime = Date.now() - startTime;
      trackTiming("total_session_duration", sessionTime, "engagement");
    };
  }, []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <WebSiteJsonLd
        url="https://nirmalhk7.com"
        potentialAction={[
          {
            target: "https://nirmalhk7.com/blog?q={search_term_string}",
            queryInput: "required name=search_term_string",
          },
        ]}
      />
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
            title: "The Blue Green Manual RSS Feed",
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
    </div>
  );
}
