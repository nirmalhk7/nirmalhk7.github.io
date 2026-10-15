import React, { useId, useRef } from "react";
import { useContentReveal } from "@/hooks/useContentReveal";
import { AnimatePresence, m, useReducedMotion, useIsPresent } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import HiringLinks from './HiringLinks';
import styles from "./editorial.styles";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  image?: StaticImageData | string;
  imageAlt?: string;
  children?: React.ReactNode;
  compact?: boolean;
  variant?: "display" | "article";
};

export function PageHero({ title, description, image, imageAlt = "", children, compact = false, variant = "display" }: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  useContentReveal(heroRef);
  return (
    <header ref={heroRef} data-navigation-hero className={`${styles.hero} ${compact ? styles.heroCompact : ""} ${variant === "article" ? styles.heroArticle : ""} ${image ? styles.heroWithImage : ""}`}>
      {image && <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={styles.heroImage} />}
      <div className={styles.heroShade} aria-hidden="true" />
      <div data-reveal className={styles.heroContent}>
        <h1>{title}</h1>
        {description && <p className={styles.heroDescription}>{description}</p>}
        {children && <div className={styles.heroActions}>{children}</div>}
      </div>
    </header>
  );
}

type PageSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "paper" | "muted" | "ink";
  children: React.ReactNode;
  className?: string;
};

export function PageSection({ id, title, description, tone = "paper", children, className = "" }: PageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useContentReveal(sectionRef);
  return (
    <section ref={sectionRef} id={id} className={`${styles.section} ${styles[`tone${tone}`]} ${className}`}>
      <div className={styles.sectionInner}>
        {(title || description) && (
          <div data-reveal className={styles.sectionHeading}>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

type EditorialRowProps = {
  index: number;
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  image?: StaticImageData | string;
  imageAlt?: string;
  href?: string;
  contentId?: string;
  onClick?: () => void;
  expanded?: boolean;
  controlLabel?: string;
  children?: React.ReactNode;
};

export function EditorialRow({ index, eyebrow, title, description, meta, image, imageAlt = "", href, contentId, onClick, expanded, controlLabel, children }: EditorialRowProps) {
  const reduceMotion = useReducedMotion();
  const controlId = useId();
  const panelId = `${controlId}-detail`;
  const rowRef = useRef<HTMLElement>(null);
  useContentReveal(rowRef);
  const content = (
    <>
      <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.rowCopy}>
        {eyebrow && <span className={styles.rowEyebrow}>{eyebrow}</span>}
        <span className={styles.rowTitle}>{title}</span>
        {description && <span className={styles.rowDescription}>{description}</span>}
      </span>
      {image && <span className={styles.rowImage}><Image src={image} alt={imageAlt} fill sizes="(max-width: 767px) 28vw, 180px" /></span>}
      {meta && <span className={styles.rowMeta}>{meta}</span>}
      {href ? <span className={styles.rowArrow} aria-hidden="true">↗</span> : (
        <svg className={styles.rowToggle} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 12h14" />
          <path className={styles.rowToggleVertical} d="M12 5v14" />
        </svg>
      )}
    </>
  );

  return (
    <article ref={rowRef} data-analytics-exposure={contentId} className={`${styles.row} ${expanded ? styles.rowExpanded : ""}`}>
      {href ? (
        <Link data-analytics-skip-global={onClick ? "true" : undefined} href={href} onClick={onClick} data-reveal className={styles.rowControl}>{content}</Link>
      ) : (
        <button data-analytics-skip-global={onClick ? "true" : undefined} data-analytics-id="editorial_control_2" type="button" id={controlId} aria-controls={panelId} onClick={onClick} aria-expanded={expanded} aria-label={controlLabel} data-reveal className={styles.rowControl}>{content}</button>
      )}
      <AnimatePresence initial={false}>
        {children && (
          <AccordionDetail key="row-detail" id={panelId} controlId={controlId} reduceMotion={Boolean(reduceMotion)}>
            {children}
          </AccordionDetail>
        )}
      </AnimatePresence>
    </article>
  );
}

function AccordionDetail({ id, controlId, reduceMotion, children }: {
  id: string; controlId: string; reduceMotion: boolean; children: React.ReactNode;
}) {
  const isPresent = useIsPresent();
  return (
    <m.div
      id={id}
      role="region"
      aria-labelledby={controlId}
      aria-hidden={!isPresent}
      ref={element => { if (element) element.inert = !isPresent; }}
      className={styles.rowDetailMotion}
      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        height: { duration: reduceMotion ? 0 : isPresent ? 0.36 : 0.28, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: reduceMotion ? 0 : isPresent ? 0.22 : 0.12 },
      }}
    >
      {children}
    </m.div>
  );
}

export function ContactBand() {
  return (
    <aside className={styles.contactBand} aria-label="Contact Nirmal">
      <div>
        <h2>Let&apos;s build something that lasts.</h2>
        <p>Have an engineering role in mind? Let&apos;s talk.</p>
      </div>
      <HiringLinks />
    </aside>
  );
}

export { styles as editorialStyles };
