import { sanitizeAnalyticsUrl, sanitizeAnalyticsReferrer } from './analyticsPrivacy';
export const CONSENT_KEY = 'analytics-consent-v1';
export const CONSENT_EVENT = 'analytics-consent-change';
export type ConsentChoice = { analytics: boolean; advertising: boolean };
export type ConsentState = ConsentChoice & { decided: boolean };
let memory: (ConsentChoice & { version: number; expires: number }) | undefined;
let initializedId = '';
const denied: ConsentState = { analytics: false, advertising: false, decided: false };

export const validMeasurementId = (id: string) => /^G-[A-Z0-9]+$/.test(id);
export function gaCommand(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  const win = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (!win.gtag) {
    win.dataLayer = win.dataLayer || [];
    win.gtag = function () {
      // eslint-disable-next-line prefer-rest-params -- gtag consumes Arguments commands.
      win.dataLayer?.push(arguments);
    };
  }
  win.gtag(...args);
}
export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return denied;
  let record = memory;
  if (!record) { try { record = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch { /* storage unavailable */ } }
  if (!record || record.version !== 1 || !Number.isFinite(record.expires) || record.expires <= Date.now() || record.expires > Date.now() + 181 * 86400000 || typeof record.analytics !== 'boolean' || typeof record.advertising !== 'boolean') return denied;
  return { analytics: record.analytics, advertising: record.advertising, decided: true };
}
const googleConsent = (choice: ConsentChoice) => ({
  analytics_storage: choice.analytics ? 'granted' : 'denied',
  ad_storage: choice.advertising ? 'granted' : 'denied',
  ad_user_data: choice.advertising ? 'granted' : 'denied',
  ad_personalization: choice.advertising ? 'granted' : 'denied',
});
export function initializeAnalytics(id: string) {
  if (typeof window === 'undefined' || (document as Document & {prerendering?:boolean}).prerendering || !validMeasurementId(id) || initializedId === id) return;
  initializedId = id;
  gaCommand('consent', 'default', googleConsent(readConsent()));
  gaCommand('js', new Date());
  gaCommand('config', id, { send_page_view: false, page_location: sanitizeAnalyticsUrl(window.location.href), page_referrer: sanitizeAnalyticsReferrer(document.referrer) });
}
export function updateConsent(choice: ConsentChoice) {
  memory = {version: 1, expires: Date.now() + 180 * 86400000, ...choice};
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(memory)); } catch { /* Keep in memory. */ }
  synchronizeConsent();
}
export function synchronizeConsent(fromStorage = false) {
  if (fromStorage) memory=undefined;
  const state = readConsent();
  if (initializedId) gaCommand('consent', 'update', googleConsent(state));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}
