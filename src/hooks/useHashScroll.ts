import { useEffect } from "react";

// Native/Next hash scrolling can run before the entering page has mounted.
export function useHashScroll(route: string) {
  useEffect(() => {
    let frame = 0;
    const align = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;
        let id: string;
        try { id = decodeURIComponent(hash); } catch { return; }
        // Instant bypasses the global smooth-scroll CSS during hydration.
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    };
    align();
    window.addEventListener("hashchange", align);
    window.addEventListener("portfolio-layout-ready", align);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", align);
      window.removeEventListener("portfolio-layout-ready", align);
    };
  }, [route]);
}
