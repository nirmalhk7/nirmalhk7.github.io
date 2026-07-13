import { useEffect } from "react";
import { useRouter } from "next/router";

export function useViewTransitions() {
  const router = useRouter();

  useEffect(() => {
    if (!("startViewTransition" in document)) {
      return;
    }

    const handleRouteChangeStart = () => {
      // Notify browser that a transition is occurring
      document.documentElement.classList.add("page-transitioning");
    };

    const handleRouteChangeComplete = () => {
      document.documentElement.classList.remove("page-transitioning");
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);
}
