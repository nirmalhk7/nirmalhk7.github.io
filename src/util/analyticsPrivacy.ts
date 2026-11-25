import { attribution, sanitizeAnalyticsReferrer, sanitizeAnalyticsUrl, sensitive } from './analyticsUrl';
export { sanitizeAnalyticsReferrer, sanitizeAnalyticsUrl } from './analyticsUrl';
export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsPayload = Record<string, AnalyticsValue>;

const urlKeys = new Set(['page_location', 'page_referrer', 'link_url', 'destination', 'destination_page_path', 'previous_page_path', 'page_path', 'shared_path']);
// Required context appears first; optional fields never displace it at GA4's 25-parameter cap.
const fields = ['page_location', 'page_referrer', 'page_path', 'page_title', 'page_type', 'content_id', 'viewport_width', 'viewport_height', 'language',
  'view_type', 'navigation_type', 'interaction_type', 'action', 'action_method', 'placement', 'source', 'section_id', 'content_type', 'item_id', 'item_list_name', 'item_index',
  'event_category', 'event_label', 'link_url', 'link_domain', 'link_id', 'outbound', 'destination', 'destination_page_path', 'previous_page_path',
  'button_id', 'button_type', 'target_id', 'selection_length', 'form_id', 'form_name', 'form_submit_text', 'field_id', 'field_state', 'lead_source', 'error_count', 'error_category', 'fatal',
  'depth_percentage', 'milestone_seconds', 'engagement_time_msec', 'active_time_msec', 'visibility_state', 'max_scroll_percentage',
  'search_scope', 'query_length', 'result_count', 'matched_ids', 'matched_id_1', 'matched_id_2', 'matched_id_3', 'matched_id_4', 'matched_id_5', 'active_filter', 'category', 'method', 'share_action', 'share_placement', 'shared_path', 'shared_at',
  'file_name', 'file_extension', 'name', 'value', 'duration_msec', 'metric_id', 'metric_name', 'metric_value', 'metric_label', 'metric_start_time', 'metric_rating',
  ...attribution];

const stringLimits: Record<string, number> = { page_title: 300, page_location: 1000, page_referrer: 420 };

function sanitizeString(key: string, value: string): string | undefined {
  if (urlKeys.has(key)) {
    const url = key === 'page_referrer' ? sanitizeAnalyticsReferrer(value) : sanitizeAnalyticsUrl(value, key === 'link_url');
    return url ? url.slice(0, stringLimits[key] ?? 100) : undefined;
  }
  const allowed = key === 'metric_id' ? /^[\w.-]{1,100}$/.test(value) : !sensitive.test(value);
  return allowed ? value.slice(0, stringLimits[key] ?? 100) : undefined;
}

export function sanitizeAnalyticsPayload(payload: Record<string, unknown>): AnalyticsPayload {
  const clean: AnalyticsPayload = {};
  for (const key of fields) {
    if (Object.keys(clean).length >= 25) break;
    const candidate = payload[key];
    const value = typeof candidate === 'string' ? sanitizeString(key, candidate) : candidate;
    if (typeof value === 'number' && !Number.isFinite(value)) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') clean[key] = value;
  }
  return clean;
}
