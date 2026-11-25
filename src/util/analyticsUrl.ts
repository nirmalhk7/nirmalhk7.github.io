import { blogIds, projectIds } from './analyticsCatalog';

const clickIdentifiers = new Set(['gclid','dclid','gbraid','wbraid','srsltid']);
export const attribution = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic', 'gclid', 'dclid', 'gbraid', 'wbraid', 'srsltid']);
const routes = new Set(['/', '/projects', '/blog', '/resume', '/design', '/privacy', '/404', '/500', '/Resume.pdf', '/api/rss']);
export const sensitive = /@|(?:\b(?:\d[ -]?){9,}\b)|(?:bearer\s|password=|token=)|[\r\n]/i;

const portfolioHosts = new Set(['nirmalhk7.com', 'www.nirmalhk7.com', 'nirmalhk7.github.io']);
const siteOrigin = () => typeof window === 'undefined' ? 'https://nirmalhk7.com' : window.location.origin;
const isInternal = (url: URL, origin: string) => url.origin === origin || portfolioHosts.has(url.hostname);

function allowedAttribution(key: string, value: string) {
  const limit = clickIdentifiers.has(key) ? 900 : 100;
  return attribution.has(key) && !sensitive.test(value) && value.length <= limit && /^[\w .~+-]+$/.test(value);
}

function setBoundedAttribution(url: URL, key: string, value: string) {
  const previous = url.searchParams.get(key);
  url.searchParams.set(key, value);
  if (url.href.length <= 1000) return;
  if (previous === null) url.searchParams.delete(key);
  else url.searchParams.set(key, previous);
}

function copyQuery(source: URL, clean: URL, route: string) {
  for (const [key, value] of source.searchParams) {
    if (allowedAttribution(key, value)) setBoundedAttribution(clean, key, value);
    const selectedProject = route === '/projects' && projectIds.includes(value);
    if (key === 'id' && selectedProject) clean.searchParams.set(key, value);
  }
}

function cleanPath(pathname: string, route: string, internal: boolean) {
  if (!internal) return sensitive.test(pathname) ? '/' : pathname;
  const known = routes.has(route) || blogIds.some(id => route === `/blog/${id}`);
  return known ? pathname : '/unknown';
}

export function sanitizeAnalyticsUrl(value: string, external = false): string {
  if (!value) return '';
  try {
    const base = siteOrigin();
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const internal = isInternal(url, base);
    const pathname = decodeURIComponent(url.pathname);
    const route = pathname.replace(/^\/en-US(?=\/|$)/, '') || '/';
    const clean = new URL(url.origin);
    clean.pathname = cleanPath(pathname, route, internal);
    if (internal && !external) copyQuery(url, clean, route);
    return value.startsWith('/') && !value.startsWith('//') ? clean.pathname + clean.search : clean.href;
  } catch { return ''; }
}

export function sanitizeAnalyticsReferrer(value: string): string {
  const clean = sanitizeAnalyticsUrl(value, true);
  if (!clean) return '';
  try {
    const url = new URL(clean);
    if (!isInternal(url, siteOrigin())) url.pathname = '/';
    return url.href;
  } catch { return ''; }
}
