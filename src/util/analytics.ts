import { sendGAEvent } from "@next/third-parties/google";

/**
 * Universal tracking function for maximum surveillance.
 * Tracks to Google Analytics and can be extended for others.
 */
export const trackClick = (label: string, category: string, extra = {}) => {
  console.log(`[Surveillance] Tracking click: ${label} in ${category}`, extra);
  sendGAEvent("event", "click", {
    event_category: category,
    event_label: label,
    ...extra,
  });
};
