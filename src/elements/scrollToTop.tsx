import React, { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRafThrottled } from "@/util/rafThrottle";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const scheduledVisibility = createRafThrottled(toggleVisibility);
    window.addEventListener("scroll", scheduledVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduledVisibility);
      scheduledVisibility.cancel();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] bg-accent text-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center hover:bg-accent/80 transition-colors"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faChevronUp} className="text-4xl" />
        </m.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
