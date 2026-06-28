type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsPayload = Record<string, AnalyticsValue>;

type AnalyticsEventOptions = {
  includePageContext?: boolean;
};

const isProduction = process.env.NODE_ENV === "production";

const getPageContext = (): AnalyticsPayload => {
  if (typeof window === "undefined") return {};

  return {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
    language: navigator.language,
  };
};

const sanitizePayload = (payload: AnalyticsPayload): AnalyticsPayload =>
  Object.entries(payload).reduce<AnalyticsPayload>((cleaned, [key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
    return cleaned;
  }, {});

export const getRoutePageType = (routePath: string) => {
  const normalizedPath = routePath.split("?")[0].split("#")[0];

  if (normalizedPath === "/") return "home";
  if (normalizedPath === "/projects") return "projects";
  if (normalizedPath === "/blog") return "blog_index";
  if (normalizedPath.startsWith("/blog/")) return "blog_post";
  if (normalizedPath === "/resume") return "resume";
  if (normalizedPath === "/404") return "404";
  if (normalizedPath === "/design") return "design";

  return "other";
};

const logDevelopmentEvent = (eventName: string, payload: AnalyticsPayload) => {
  if (!isProduction) {
    console.log(`[Analytics] ${eventName}`, payload);
  }
};

const pushGAEvent = (eventName: string, payload: AnalyticsPayload) => {
  if (typeof window === "undefined") return;

  const win = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  if (typeof win.gtag === "function") {
    win.gtag("event", eventName, payload);
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(["event", eventName, payload]);
};

const getVercelAnalytics = () => {
  if (typeof window === "undefined") return undefined;

  const vercelWindow = window as Window & {
    va?: (event: "event", properties?: unknown) => void;
    vaq?: [string, unknown?][];
  };

  if (!vercelWindow.va) {
    vercelWindow.va = (event, properties) => {
      vercelWindow.vaq = vercelWindow.vaq || [];
      vercelWindow.vaq.push([event, properties]);
    };
  }

  return vercelWindow.va;
};

export const trackEvent = (
  eventName: string,
  properties: AnalyticsPayload = {},
  options: AnalyticsEventOptions = {}
) => {
  const includePageContext = options.includePageContext ?? true;
  const payload = sanitizePayload({
    ...(includePageContext ? getPageContext() : {}),
    ...properties,
  });

  if (!isProduction) {
    logDevelopmentEvent(eventName, payload);
    return;
  }

  pushGAEvent(eventName, payload);

  getVercelAnalytics()?.("event", {
    name: eventName,
    data: payload,
  });
};

export const trackClick = (label: string, category: string, extra: AnalyticsPayload = {}) => {
  trackEvent("click", {
    event_category: category,
    event_label: label,
    ...extra,
  });
};

export const trackView = (sectionId: string, extra: AnalyticsPayload = {}) => {
  trackEvent("section_view", {
    section_id: sectionId,
    ...extra,
  });
};

export const trackSectionView = trackView;

export const trackPageView = (pagePath: string, extra: AnalyticsPayload = {}) => {
  trackEvent("page_view", {
    page_path: pagePath,
    page_type: getRoutePageType(pagePath),
    ...extra,
  });
};

export const trackScrollDepth = (depth: number, extra: AnalyticsPayload = {}) => {
  trackEvent("scroll_depth", {
    depth_percentage: depth,
    ...extra,
  });
};

export const trackFormFocus = (fieldId: string, formId = "contact_form") => {
  trackEvent("form_engagement", {
    action: "focus",
    field_id: fieldId,
    form_id: formId,
  });
};

export const trackFormStart = (formId: string, formName: string) => {
  trackEvent("form_start", {
    form_id: formId,
    form_name: formName,
  });
};

export const trackFormSubmit = (formId: string, formName: string, submitText?: string) => {
  trackEvent("form_submit", {
    form_id: formId,
    form_name: formName,
    form_submit_text: submitText,
  });
};

export const trackGenerateLead = (leadSource: string, extra: AnalyticsPayload = {}) => {
  trackEvent("generate_lead", {
    lead_source: leadSource,
    ...extra,
  });
};

export const trackSearch = (searchTerm: string, extra: AnalyticsPayload = {}) => {
  const trimmedSearchTerm = searchTerm.trim();
  if (!trimmedSearchTerm) return;

  trackEvent("search", {
    search_term: trimmedSearchTerm,
    ...extra,
  });
};

export const trackSelectContent = (
  contentType: string,
  contentId: string,
  extra: AnalyticsPayload = {}
) => {
  trackEvent("select_content", {
    content_type: contentType,
    content_id: contentId,
    ...extra,
  });
};

export const trackShare = (
  method: string,
  contentType: string,
  itemId: string,
  extra: AnalyticsPayload = {}
) => {
  trackEvent("share", {
    method,
    content_type: contentType,
    item_id: itemId,
    ...extra,
  });
};

export const trackFileDownload = (
  fileName: string,
  linkUrl: string,
  extra: AnalyticsPayload = {}
) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  trackEvent("file_download", {
    file_name: fileName,
    file_extension: extension,
    link_url: linkUrl,
    ...extra,
  });
};

export const trackError = (message: string, fatal: boolean = false) => {
  trackEvent("exception", {
    description: message,
    fatal: fatal,
  });
};

export const setUserProperty = (key: string, value: string) => {
  if (!isProduction) {
    console.log(`[Analytics] user_property ${key} = ${value}`);
    return;
  }
  // GA4 uses 'set' command for user properties via gtag
  if (typeof window !== "undefined") {
    const win = window as Window & {
      gtag?: (command: "set", target: "user_properties", properties: Record<string, string>) => void;
    };
    if (win.gtag) {
      win.gtag("set", "user_properties", { [key]: value });
    }
  }
};

export const trackTiming = (name: string, value: number, category?: string) => {
  trackEvent("timing_complete", {
    name: name,
    value: value,
    event_category: category,
  });
};

export const trackWebVital = (metric: {
  id: string;
  name: string;
  value: number;
  label?: string;
  startTime?: number;
  rating?: "good" | "needs-improvement" | "poor";
  navigationType?: string;
}) => {
  trackEvent("web_vital", {
    metric_id: metric.id,
    metric_name: metric.name,
    metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_label: metric.label,
    metric_start_time: metric.startTime ? Math.round(metric.startTime) : undefined,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
  });
};
