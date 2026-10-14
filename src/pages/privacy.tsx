import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { DefaultPageProps } from './_app';
import { PageHero, PageSection, editorialStyles as styles } from '@/components/Site/Editorial';

export default function PrivacyPage() {
  return <main className={styles.page}>
    <PageHero eyebrow="Privacy" title="How this site measures visits." description="Your choices control optional Analytics and Advertising storage." />
    <PageSection title="What gets measured">
      <p>Google Analytics 4 measures pages, referral sources and campaign tags, searches as counts and catalog matches, content visibility, clicks, scroll milestones, active time, sharing and download attempts, contact form states, categorized errors, and performance. Google also derives device, browser, language, and approximate location. We do not send your name, email, contact message, raw search text, or raw error messages to Analytics.</p>
      <p>Opening a share composer or PDF does not tell us whether you completed a share, finished downloading, or read a PDF. Referrers and advertising demographics may be unavailable.</p>
    </PageSection>
    <PageSection title="Consent and providers">
      <p>Google Analytics loads in Advanced Consent Mode. Until you accept Analytics, or after you withdraw it, Google can receive cookieless measurement signals without Analytics cookie storage. Accepting Analytics allows optional Analytics cookies and Vercel Analytics and Speed Insights to measure visits and performance. Vercel collection stops when Analytics consent is withdrawn.</p>
      <p>Advertising is a separate choice. Accepting it allows Google advertising storage, advertising data use, and personalization. If enabled in the Google Analytics property, eligible visitors may contribute aggregated demographic and interest information.</p>
      <p>Your versioned preference is stored in this browser for 180 days. You can change it at any time. Denying optional storage does not disable Google&apos;s cookieless measurement.</p>
      <button data-analytics-id="privacy_control_1" type="button" data-analytics-skip-global="true" onClick={()=>window.dispatchEvent(new Event('open-privacy-preferences'))}>Change privacy preferences</button>
      <p><a href="https://policies.google.com/privacy">Google privacy policy</a> · <a href="https://vercel.com/legal/privacy-policy">Vercel privacy policy</a></p>
    </PageSection>
    <PageSection title="Contact form and questions">
      <p>Contact details and messages are sent to Formspree to deliver your message, separately from Analytics. <a href="https://formspree.io/legal/privacy-policy/">Formspree privacy policy</a>.</p>
      <p>Questions about measurement or your data? <a href="mailto:nirmalhk7@gmail.com">Email Nirmal</a>. <Link href="/">Return home</Link>.</p>
    </PageSection>
  </main>;
}
export const getStaticProps: GetStaticProps<DefaultPageProps> = async()=>({props:{pageMetadata:{enableWrap:true,layoutVariant:'portfolio',seoMetadata:{title:'Privacy',description:'How this site measures visits and manages Analytics and Advertising preferences.'}}}});
