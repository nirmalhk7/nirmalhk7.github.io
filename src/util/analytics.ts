import { sendGAEvent } from "@next/third-parties/google";

/**
 * Universal tracking function for maximum surveillance.
 * Tracks to Google Analytics and can be extended for others.
 */
export const trackClick = (label: string, category: string, extra = {}) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Surveillance] Tracking click: ${label} in ${category}`, extra);
    return;
  }
  sendGAEvent("event", "click", {
    event_category: category,
    event_label: label,
    ...extra,
  });
};

export const trackView = (sectionId: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Surveillance] Section visible: ${sectionId}`);
    return;
  }
  sendGAEvent("event", "section_view", {
    section_id: sectionId,
  });
};

export const trackScrollDepth = (depth: number) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Surveillance] Scroll depth reached: ${depth}%`);
    return;
  }
  sendGAEvent("event", "scroll_depth", {
    depth_percentage: depth,
  });
};

export const trackFormFocus = (fieldId: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Surveillance] Form focus: ${fieldId}`);
    return;
  }
  sendGAEvent("event", "form_engagement", {
    action: "focus",
    field_id: fieldId,
  });
};
