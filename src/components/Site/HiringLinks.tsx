import React from 'react';
import Link from 'next/link';
import { trackClick } from '@/util/analytics';
import styles from './editorial.module.scss';

export default function HiringLinks() {
  return (
    <nav className={styles.hiringLinks} aria-label="Contact and hiring">
      <a href="mailto:nirmalhk7@gmail.com" onClick={() => trackClick('email', 'contact_link')}>Email Nirmal</a>
      <a href="https://www.linkedin.com/in/nirmalhk7/" target="_blank" rel="noopener noreferrer" onClick={() => trackClick('linkedin', 'contact_link')}>LinkedIn</a>
      <Link href="/resume" onClick={() => trackClick('resume', 'contact_link')}>View résumé</Link>
    </nav>
  );
}
