import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { 
  trackView, 
  trackScrollDepth, 
  trackClick, 
  setUserProperty, 
  trackTiming, 
  trackError 
} from "@/util/analytics";

const runAfterHydration = (callback: () => void) => {
  const timer = window.setTimeout(callback, 1200);

  return () => {
    window.clearTimeout(timer);
  };
};

export const useAnalytics = () => {
  const router = useRouter();
  const trackedMilestones = useRef<Set<number>>(new Set());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track page views on route change
    const handleRouteChange = (url: string) => {
      trackView(url);
      trackedMilestones.current.clear();
      startTime.current = Date.now();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    // Initial page view
    trackView(router.asPath);

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
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          if (url.origin !== window.location.origin && !url.href.startsWith("mailto:")) {
            trackClick(anchor.href, "outbound_link");
            trackTiming("outbound_click_latency", Date.now() - startTime.current, "engagement");
          }
          
          if (anchor.href.includes("Resume.pdf")) {
            setUserProperty("persona", "recruiter");
            trackClick("resume_download", "action");
          }
        } catch (err) {
          // Ignore invalid URLs
        }
      }
    };

    const handleGlobalError = (event: ErrorEvent) => {
      trackError(event.message, false);
    };

    const handleVisibilityChange = () => {
      trackClick(document.visibilityState, "visibility_change");
    };

    let removeDeferredListeners = () => {};

    const cancelDeferredSetup = runAfterHydration(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("click", handleGlobalClick);
      window.addEventListener("error", handleGlobalError);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      removeDeferredListeners = () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("click", handleGlobalClick);
        window.removeEventListener("error", handleGlobalError);
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
