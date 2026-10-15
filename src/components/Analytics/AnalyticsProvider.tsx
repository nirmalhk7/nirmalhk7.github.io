import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const Analytics = dynamic(()=>import('@vercel/analytics/react').then(module=>module.Analytics),{ssr:false});
const SpeedInsights = dynamic(()=>import('@vercel/speed-insights/next').then(module=>module.SpeedInsights),{ssr:false});
import { CONSENT_KEY, CONSENT_EVENT, ConsentState, initializeAnalytics, readConsent, updateConsent, synchronizeConsent, validMeasurementId } from '@/util/analyticsConsent';
import { sanitizeAnalyticsUrl } from '@/util/analyticsPrivacy';
import styles from './consent.module.css';

export function AnalyticsProvider({ hideBanner = false }: { hideBanner?: boolean }) {
  const [state, setState] = useState<ConsentState>({analytics:false, advertising:false, decided:false});
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const id = process.env.NEXT_PUBLIC_GOOGLETAG || '';
  const enabled = process.env.NODE_ENV === 'production' && validMeasurementId(id);

  useEffect(() => {
    const sync = () => { const choice=readConsent(); setState(choice); setOpen(!choice.decided); setAnalytics(choice.analytics); setAdvertising(choice.advertising); };
    const activate = () => { if (enabled) initializeAnalytics(id); sync(); setReady(true); };
    const preferences = () => { previousFocus.current=document.activeElement as HTMLElement; const choice=readConsent(); setAnalytics(choice.analytics); setAdvertising(choice.advertising); setOpen(true); setCustomize(true); };
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) synchronizeConsent(true); };
    if (!(document as Document & {prerendering?:boolean}).prerendering) activate();
    document.addEventListener('prerenderingchange', activate);
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener('storage', storage);
    window.addEventListener('open-privacy-preferences', preferences);
    return () => { document.removeEventListener('prerenderingchange', activate); window.removeEventListener(CONSENT_EVENT, sync); window.removeEventListener('storage', storage); window.removeEventListener('open-privacy-preferences', preferences); };
  }, [enabled, id]);
  useEffect(() => { if (open && customize) firstButton.current?.focus(); }, [open, customize]);
  const save = (a: boolean, ads: boolean) => { updateConsent({analytics:a, advertising:ads}); setOpen(false); setCustomize(false); previousFocus.current?.focus(); };
  return <>
    {ready && enabled && <Script id="google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />}
    {ready && enabled && state.analytics && <><Analytics beforeSend={event=>readConsent().analytics ? {...event,url:sanitizeAnalyticsUrl(event.url)} : null} /><SpeedInsights beforeSend={event=>readConsent().analytics ? {...event,url:sanitizeAnalyticsUrl(event.url)} : null} /></>}
    {ready && open && !hideBanner && <section aria-label="Privacy preferences" className={styles.banner} data-analytics-exposure-ignore="true" data-analytics-skip-global="true">
      <h2>Privacy preferences</h2>
      <p>Google Analytics measures visits and interactions. Before you accept, Google receives cookieless measurement signals. Optional cookies help recognize repeat visits; advertising features add eligible demographics and interests. <Link href="/privacy">Privacy details</Link></p>
      {customize && <div className={styles.options}>
        <label><input type="checkbox" checked={analytics} onChange={event=>setAnalytics(event.target.checked)} /> Analytics</label>
        <label><input type="checkbox" checked={advertising} onChange={event=>setAdvertising(event.target.checked)} /> Advertising</label>
      </div>}
      <div className={styles.actions}>
        <button data-analytics-id="analyticsprovider_control_2" ref={firstButton} type="button" onClick={()=>save(true,true)}>Accept all</button>
        <button data-analytics-id="analyticsprovider_control_3" type="button" onClick={()=>save(false,false)}>Reject optional</button>
        {customize ? <button data-analytics-id="analyticsprovider_control_4" type="button" onClick={()=>save(analytics,advertising)}>Save preferences</button> : <button data-analytics-id="analyticsprovider_control_5" type="button" onClick={()=>setCustomize(true)}>Customize</button>}
      </div>
    </section>}
  </>;
}
