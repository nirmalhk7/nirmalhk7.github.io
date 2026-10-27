import { analyticsEvents, AnalyticsEventName } from './analyticsEvents';
import { AnalyticsPayload, sanitizeAnalyticsPayload, sanitizeAnalyticsUrl, sanitizeAnalyticsReferrer } from './analyticsPrivacy';
import { gaCommand, initializeAnalytics, readConsent, validMeasurementId } from './analyticsConsent';
export { sanitizeAnalyticsPayload, sanitizeAnalyticsUrl } from './analyticsPrivacy';
type AnalyticsEventOptions = {
  includePageContext?: boolean;
};

const isProduction = process.env.NODE_ENV === "production";

const getPageContext = (): AnalyticsPayload => {
  if (typeof window === "undefined") return {};

  return {
    page_location: sanitizeAnalyticsUrl(window.location.href),
    page_path: sanitizeAnalyticsUrl(window.location.pathname + window.location.search),
    page_title: document.title,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    page_referrer: sanitizeAnalyticsReferrer(document.referrer),
    language: navigator.language,
  };
};

export const getRoutePageType = (routePath: string) => {
  const normalizedPath = (routePath.split("?")[0].split("#")[0].replace(/^\/en-US(?=\/|$)/,"") || "/");

  if (normalizedPath === "/") return "home";
  if (normalizedPath === "/projects") return "projects";
  if (normalizedPath === "/blog") return "blog_index";
  if (normalizedPath.startsWith("/blog/")) return "blog_post";
  if (normalizedPath === "/resume") return "resume";
  if (normalizedPath === "/404") return "404";
  if (normalizedPath === "/design") return "design";
  if (normalizedPath === "/privacy") return "privacy";
  if (normalizedPath === "/500") return "500";

  return "other";
};

const logDevelopmentEvent = (eventName: string, payload: AnalyticsPayload) => {
  if (!isProduction) {
    console.log(`[Analytics] ${eventName}`, payload);
  }
};

const getVercelAnalytics = () => {
  if (typeof window === "undefined") return undefined;

  const vercelWindow = window as Window & {
    va?: (event: "event", properties?: unknown) => void;
    vaq?: [string, unknown?][];
  };

  if (!vercelWindow.va) {
    vercelWindow.vaq = vercelWindow.vaq || [];
    vercelWindow.vaq.unshift(['beforeSend',(event: {url:string}) => readConsent().analytics ? {...event,url:sanitizeAnalyticsUrl(event.url)} : null]);
    vercelWindow.va = (event, properties) => {
      vercelWindow.vaq = vercelWindow.vaq || [];
      vercelWindow.vaq.push([event, properties]);
    };
  }

  return vercelWindow.va;
};

export const trackEvent = (
  eventName: AnalyticsEventName,
  properties: AnalyticsPayload = {},
  options: AnalyticsEventOptions = {}
) => {
  if (!Object.prototype.hasOwnProperty.call(analyticsEvents,eventName) || (typeof document!=='undefined' && (document as Document & {prerendering?:boolean}).prerendering)) return;
  const includePageContext = options.includePageContext ?? true;
  const payload = sanitizeAnalyticsPayload({
    ...(includePageContext ? getPageContext() : {}),
    ...properties,
  });

  if (!isProduction) {
    logDevelopmentEvent(eventName, payload);
    return;
  }

  const id = process.env.NEXT_PUBLIC_GOOGLETAG || "";
  if (!validMeasurementId(id)) return;
  initializeAnalytics(id);
  gaCommand("event", eventName, payload);

  if (readConsent().analytics) getVercelAnalytics()?.("event", {
    name: eventName,
    data: payload,
  });
};

export const trackClick = (label: string, category: string, extra: AnalyticsPayload = {}) => {
  trackEvent("ui_action", {
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
  const id=process.env.NEXT_PUBLIC_GOOGLETAG || "";
  if (isProduction && validMeasurementId(id)) { initializeAnalytics(id); gaCommand("set", sanitizeAnalyticsPayload(getPageContext())); }
  trackEvent("page_view", {
    page_path: pagePath,
    page_type: getRoutePageType(pagePath),
    ...extra,
    page_location: sanitizeAnalyticsUrl(typeof window === "undefined" ? pagePath : new URL(pagePath,window.location.origin).href),
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

  const matches=typeof extra.matched_ids==="string" ? extra.matched_ids.split(",").slice(0,5) : [];
  const matchFields=Object.fromEntries(matches.map((id,index)=>[`matched_id_${index+1}`,id]));
  trackEvent("site_search", {
    query_length: trimmedSearchTerm.length,
    ...extra,
    ...matchFields,
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
    error_category: message === "404 Not Found" ? "not_found" : "runtime",
    fatal: fatal,
  });
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

/** Opening the résumé page is a content view, not a PDF download. */
export const trackResumeOpen = (source: string, extra: AnalyticsPayload = {}) => {
  trackSelectContent("resume", "resume", { source, link_url: "/resume", interaction_type: "view", ...extra });
};
