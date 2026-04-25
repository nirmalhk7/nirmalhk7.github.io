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

export const trackError = (message: string, fatal: boolean = false) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[Surveillance] Error captured: ${message}`);
    return;
  }
  sendGAEvent("event", "exception", {
    description: message,
    fatal: fatal,
  });
};

export const setUserProperty = (key: string, value: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Surveillance] Setting User Property: ${key} = ${value}`);
    return;
  }
  // GA4 uses 'set' command for user properties via gtag
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win.gtag) {
      win.gtag("set", "user_properties", { [key]: value });
    }
  }
};

export const trackTiming = (name: string, value: number, category?: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Surveillance] Timing (${name}): ${value}ms`);
    return;
  }
  sendGAEvent("event", "timing_complete", {
    name: name,
    value: value,
    event_category: category,
  });
};
