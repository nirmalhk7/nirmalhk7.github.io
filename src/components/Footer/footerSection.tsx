import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { social } from "@/components/Social/socialSection";
import { trackSelectContent } from "@/util/analytics";
import styles from "@/components/Home/portfolio.module.scss";

type FooterSectionProps = { variant?: "default" | "portfolio" };

const FooterSection = React.forwardRef<HTMLElement, FooterSectionProps>((_, ref) => (
  <footer ref={ref} className={styles.portfolioFooter}>
    <div className={styles.footerInner}>
      <div className={styles.footerTop}>
        <Link href="/" className={styles.footerBrand}>nirmalhk7</Link>
        <p>Built by Nirmal Khedkar.</p>
      </div>
      <ul className={styles.footerLinks} aria-label="Social profiles">
        {social.filter((item) => item.link).map((item) => (
          <li key={item.name}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-skip-global="true"
              onClick={() => {
                trackSelectContent("footer_social_profile", item.name, { link_url: item.link });
              }}
            >
              <FontAwesomeIcon icon={item.class} size="sm" />
              <span>{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.footerLinks}><Link href="/privacy">Privacy</Link><button data-analytics-id="footersection_control_4" type="button" data-analytics-skip-global="true" onClick={() => window.dispatchEvent(new Event("open-privacy-preferences"))}>Privacy preferences</button></div>
      <small>© {new Date().getFullYear()} Nirmal Khedkar</small>
    </div>
  </footer>
));

FooterSection.displayName = "FooterSection";
export default FooterSection;
