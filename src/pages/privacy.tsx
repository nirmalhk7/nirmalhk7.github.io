import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { DefaultPageProps } from './_app';
import { PageHero, PageSection, editorialStyles as styles } from '@/components/Site/Editorial';

export default function PrivacyPage() {
  return <main className={styles.page}>
    <PageHero eyebrow="Privacy" title="How this site measures visits." description="Your choices control optional Analytics and Advertising storage." />
    <PageSection title="Why this site uses measurement">
      <p>Last updated: October 21, 2026. Nirmal operates this portfolio and uses measurement to understand which content visitors find useful, how they discover projects and articles, whether contact attempts succeed, and how to improve site performance.</p>
    </PageSection>
    <PageSection title="What gets measured">
      <p>Google Analytics 4 measures pages, referral sources and campaign tags, searches as counts and catalog matches, search clearing, content visibility and time in view, page and content scroll milestones, active time, clicks including middle-clicks, sustained control hover and focus, text-selection length, sharing and download attempts, contact form states and field-focus duration, categorized errors, navigation timing, viewport and online/offline changes, and performance. Google also derives device, browser, language, and approximate location. We do not send your name, email, contact message, field values, selected text, raw search text, or raw error messages to Analytics.</p>
      <p>We record when the résumé frame reports loading. This does not prove that the PDF rendered successfully or was read. Opening a share composer or PDF does not tell us whether you completed a share or finished downloading. Time in view and scroll progress indicate exposure, not proof of reading. Referrers and advertising demographics may be unavailable.</p>
    </PageSection>
    <PageSection title="Consent and providers">
      <p>Google Analytics loads in Advanced Consent Mode. Until you accept Analytics, or after you withdraw it, Google can receive cookieless measurement signals without Analytics cookie storage. Accepting Analytics allows optional Analytics cookies and Vercel Analytics and Speed Insights to measure visits and performance. Vercel collection stops when Analytics consent is withdrawn.</p>
      <p>Cookieless does not mean that no data reaches Google: measurement requests can include page and event information, timestamps, browser information, and consent status. Your IP address is also transmitted as part of the network connection. Google may use eligible measurement signals to estimate missing activity; modeled reports depend on Google&apos;s eligibility requirements.</p>
      <p>With Analytics consent, first-party cookies such as <code>_ga</code> and <code>_ga_*</code> distinguish browsers and sessions, helping measure repeat visits and journeys through the site. Google documents a default lifetime of two years for these cookies; browser limits and Google tag settings can shorten or change it. Cookie lifetime is separate from how long reports and event data are retained.</p>
      <p>Advertising is a separate choice. Accepting it allows Google advertising storage, advertising data use, and personalization. If Google signals is enabled in the Analytics property, eligible visitors may contribute aggregated demographic and interest information. These features can use first-party Analytics cookies or identifiers together with Google&apos;s third-party advertising cookies or identifiers. Availability depends on your consent, Google account settings, browser, region, and the property configuration.</p>
      <p>Your versioned preference is stored in this browser for 180 days. You can change it at any time. Denying optional storage does not disable Google&apos;s cookieless measurement.</p>
      <button data-analytics-id="privacy_control_1" type="button" data-analytics-skip-global="true" onClick={()=>window.dispatchEvent(new Event('open-privacy-preferences'))}>Change privacy preferences</button>
      <p>Use Customize to choose Analytics and Advertising independently, or Reject optional to deny both. Changing these settings controls future collection and use; it does not automatically erase data already collected or remove existing cookies. You can also delete cookies through your browser settings.</p>
      <p>For additional Google controls, visit <a href="https://myadcenter.google.com/">My Ad Center</a> to manage personalized advertising, or use the <a href="https://tools.google.com/dlpage/gaoptout?hl=en">Google Analytics opt-out browser add-on</a> in a supported browser. Advertising settings do not turn off all Analytics measurement.</p>
      <p><a href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites that use its services</a> · <a href="https://policies.google.com/privacy">Google privacy policy</a> · <a href="https://vercel.com/legal/privacy-policy">Vercel privacy policy</a></p>
    </PageSection>
    <PageSection title="Contact form and questions">
      <p>Contact details and messages are sent to Formspree to deliver your message, separately from Analytics. <a href="https://formspree.io/legal/privacy-policy/">Formspree privacy policy</a>.</p>
      <p>Questions about measurement or your data? <a href="mailto:nirmalhk7@gmail.com">Email Nirmal</a>. <Link href="/">Return home</Link>.</p>
    </PageSection>
  </main>;
}
export const getStaticProps: GetStaticProps<DefaultPageProps> = async()=>({props:{pageMetadata:{enableWrap:true,layoutVariant:'portfolio',seoMetadata:{title:'Privacy',description:'How this site measures visits and manages Analytics and Advertising preferences.'}}}});
