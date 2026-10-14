import { blogIds, projectIds } from './analyticsCatalog';
export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsPayload = Record<string, AnalyticsValue>;

const clickIdentifiers = new Set(['gclid','dclid','gbraid','wbraid','srsltid']);
const attribution = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic', 'gclid', 'dclid', 'gbraid', 'wbraid', 'srsltid']);
const routes = new Set(['/', '/projects', '/blog', '/resume', '/design', '/privacy', '/404', '/500', '/Resume.pdf', '/api/rss']);
const sensitive = /@|(?:\b(?:\d[ -]?){9,}\b)|(?:bearer\s|password=|token=)|[\r\n]/i;
const urlKeys = new Set(['page_location', 'page_referrer', 'link_url', 'destination', 'destination_page_path', 'previous_page_path', 'page_path', 'shared_path']);
// Required context appears first; optional fields never displace it at GA4's 25-parameter cap.
const fields = ['page_location', 'page_referrer', 'page_path', 'page_title', 'page_type', 'content_id', 'viewport_width', 'viewport_height', 'language',
  'view_type', 'navigation_type', 'interaction_type', 'action', 'action_method', 'placement', 'source', 'section_id', 'content_type', 'item_id', 'item_list_name', 'item_index',
  'event_category', 'event_label', 'link_url', 'link_domain', 'link_id', 'outbound', 'destination', 'destination_page_path', 'previous_page_path',
  'button_id', 'button_type', 'form_id', 'form_name', 'form_submit_text', 'field_id', 'lead_source', 'error_count', 'error_category', 'fatal',
  'depth_percentage', 'milestone_seconds', 'engagement_time_msec', 'active_time_msec', 'visibility_state', 'max_scroll_percentage',
  'search_scope', 'query_length', 'result_count', 'matched_ids', 'matched_id_1', 'matched_id_2', 'matched_id_3', 'matched_id_4', 'matched_id_5', 'active_filter', 'category', 'method', 'share_action', 'share_placement', 'shared_path', 'shared_at',
  'file_name', 'file_extension', 'name', 'value', 'duration_msec', 'metric_id', 'metric_name', 'metric_value', 'metric_label', 'metric_start_time', 'metric_rating',
  ...attribution];

export function sanitizeAnalyticsUrl(value: string, external = false): string {
  if (!value) return '';
  try {
    const base = typeof window === 'undefined' ? 'https://nirmalhk7.com' : window.location.origin;
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const internal = url.origin === base || ['nirmalhk7.com', 'www.nirmalhk7.com', 'nirmalhk7.github.io'].includes(url.hostname);
    let pathname = url.pathname;
    try { pathname = decodeURIComponent(pathname); } catch { return ''; }
    const routePath=pathname.replace(/^\/en-US(?=\/|$)/,'') || '/';
    if (internal) {
      if (!routes.has(routePath) && !blogIds.some(id => routePath === `/blog/${id}`)) pathname = '/unknown';
    } else if (sensitive.test(pathname)) pathname = '/';
    const clean = new URL(url.origin);
    clean.pathname = pathname;
    if (internal && !external) {
      for (const [key, val] of url.searchParams) {
        if (attribution.has(key) && !sensitive.test(val) && val.length <= (clickIdentifiers.has(key)?900:100) && /^[\w .~+-]+$/.test(val)) {
          const previous=clean.searchParams.get(key);
          clean.searchParams.set(key,val);
          if (clean.href.length>1000) { if (previous===null) clean.searchParams.delete(key); else clean.searchParams.set(key,previous); }
        }
        if (key === 'id' && routePath === '/projects' && projectIds.includes(val)) clean.searchParams.set(key, val);
      }
    }
    return value.startsWith('/') && !value.startsWith('//') ? clean.pathname + clean.search : clean.href;
  } catch { return ''; }
}

export function sanitizeAnalyticsReferrer(value: string): string {
  const clean=sanitizeAnalyticsUrl(value,true);
  if (!clean) return '';
  try { const url=new URL(clean); const ownOrigin=typeof window==='undefined'?'https://nirmalhk7.com':window.location.origin; if (url.origin!==ownOrigin && !['nirmalhk7.com','www.nirmalhk7.com','nirmalhk7.github.io'].includes(url.hostname)) url.pathname='/'; return url.href; } catch { return ''; }
}

export function sanitizeAnalyticsPayload(payload: Record<string, unknown>): AnalyticsPayload {
  const clean: AnalyticsPayload = {};
  for (const key of fields) {
    if (Object.keys(clean).length >= 25) break;
    const candidate = payload[key];
    if (typeof candidate !== 'string' && typeof candidate !== 'number' && typeof candidate !== 'boolean') continue;
    let val: string | number | boolean = candidate;
    if (typeof val === 'number' && !Number.isFinite(val)) continue;
    if (typeof val === 'string') {
      if (urlKeys.has(key)) {
        val = key==='page_referrer' ? sanitizeAnalyticsReferrer(val) : sanitizeAnalyticsUrl(val, key === 'link_url');
        if (!val) continue;
      } else if (key === 'metric_id' ? !/^[\w.-]{1,100}$/.test(val) : sensitive.test(val)) continue;
      const limit = key === 'page_title' ? 300 : key === 'page_location' ? 1000 : key === 'page_referrer' ? 420 : 100;
      val = val.slice(0, limit);
    }
    clean[key] = val;
  }
  return clean;
}
