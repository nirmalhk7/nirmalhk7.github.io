import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { 
  trackPageView,
  trackScrollDepth, 
  trackClick, 
  setUserProperty, 
  trackTiming, 
  trackError,
  trackEvent,
  trackFileDownload,
  trackSelectContent,
} from "@/util/analytics";

const runAfterHydration = (callback: () => void) => {
  const timer = window.setTimeout(callback, 1200);

  return () => {
    window.clearTimeout(timer);
  };
};

const shouldSkipGlobalTracking = (target: Element) =>
  Boolean(target.closest("[data-analytics-skip-global='true']"));

export const useAnalytics = () => {
  const router = useRouter();
  const trackedMilestones = useRef<Set<number>>(new Set());
  const startTime = useRef<number>(Date.now());
  const currentPath = useRef<string>(router.asPath);

  useEffect(() => {
    // Track page views on route change
    const handleRouteChange = (url: string) => {
      const previousPath = currentPath.current;
      const engagementTime = Date.now() - startTime.current;

      trackTiming("page_engagement_duration", engagementTime, "engagement");
      trackEvent("page_navigation", {
        previous_page_path: previousPath,
        destination_page_path: url,
        navigation_type: "client_route",
      });
      trackPageView(url, {
        view_type: "route",
      });
      trackedMilestones.current.clear();
      startTime.current = Date.now();
      currentPath.current = url;
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    // Initial page view
    trackPageView(router.asPath, {
      view_type: "route",
    });

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    let lastScrollCheck = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollCheck < 500) return;
      lastScrollCheck = now;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      [25, 50, 75, 90].forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedMilestones.current.has(milestone)) {
          trackScrollDepth(milestone);
          trackedMilestones.current.add(milestone);
          
          if (milestone === 75) setUserProperty("persona", "engaged_reader");
        }
      });
    };

    // Global outbound link and resume tracking
    const handleGlobalClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) {
        return;
      }

      const target = e.target;
      if (shouldSkipGlobalTracking(target)) {
        return;
      }

      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          const linkText = anchor.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || anchor.title || url.pathname;
          const isOutbound = url.origin !== window.location.origin && !url.href.startsWith("mailto:");

          trackEvent("link_click", {
            link_url: url.href,
            link_domain: url.hostname,
            link_id: anchor.id,
            link_text: linkText,
            link_classes: anchor.className,
            outbound: isOutbound,
          });

          if (url.origin !== window.location.origin && !url.href.startsWith("mailto:")) {
            trackClick(anchor.href, "outbound_link", {
              link_url: url.href,
              link_domain: url.hostname,
              link_text: linkText,
              outbound: true,
            });
            trackTiming("outbound_click_latency", Date.now() - startTime.current, "engagement");
          }
          
          if (anchor.href.includes("Resume.pdf")) {
            setUserProperty("persona", "recruiter");
            trackFileDownload("Resume.pdf", anchor.href, {
              link_text: linkText,
              source: "anchor_click",
            });
            trackSelectContent("resume", "Resume.pdf", {
              interaction_type: "download",
            });
            trackClick("resume_download", "action", {
              link_url: anchor.href,
            });
          }
        } catch (err) {
          // Ignore invalid URLs
        }
      }

      const button = target.closest("button");
      if (button) {
        trackEvent("button_click", {
          button_id: button.id,
          button_text: button.textContent?.trim().replace(/\s+/g, " ").slice(0, 120),
          button_type: button.type,
          button_classes: button.className,
          form_id: button.form?.id,
        });
      }
    };

    const handleGlobalError = (event: ErrorEvent) => {
      trackError(event.message, false);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason =
        event.reason instanceof Error
          ? event.reason.message
          : typeof event.reason === "string"
            ? event.reason
            : "Unhandled promise rejection";

      trackError(reason, false);
    };

    const handleVisibilityChange = () => {
      trackEvent("visibility_change", {
        visibility_state: document.visibilityState,
        engagement_time_msec: Date.now() - startTime.current,
      });
    };

    let removeDeferredListeners = () => {};

    const cancelDeferredSetup = runAfterHydration(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("click", handleGlobalClick);
      window.addEventListener("error", handleGlobalError);
      window.addEventListener("unhandledrejection", handleUnhandledRejection);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      removeDeferredListeners = () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("click", handleGlobalClick);
        window.removeEventListener("error", handleGlobalError);
        window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    });

    return () => {
      cancelDeferredSetup();
      removeDeferredListeners();
      
      const sessionTime = Date.now() - startTime.current;
      trackTiming("total_session_duration", sessionTime, "engagement");
    };
  }, []);
};
