import Link from "next/link";
import React from 'react';
import { trackClick, trackResumeOpen } from '@/util/analytics';
import styles from './editorial.module.scss';

export default function HiringLinks() {
  return (
    <nav className={styles.hiringLinks} aria-label="Contact and hiring">
      <a data-analytics-skip-global="true" href="mailto:nirmalhk7@gmail.com" onClick={() => trackClick('email', 'contact_link')}>Email Nirmal</a>
      <a data-analytics-skip-global="true" href="https://www.linkedin.com/in/nirmalhk7/" target="_blank" rel="noopener noreferrer" onClick={() => trackClick('linkedin', 'contact_link')}>LinkedIn</a>
      <Link data-analytics-skip-global="true" href="/resume" onClick={() => trackResumeOpen('contact_link')}>View résumé</Link>
    </nav>
  );
}
