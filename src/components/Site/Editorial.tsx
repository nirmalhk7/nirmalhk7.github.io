import React from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import HiringLinks from './HiringLinks';
import styles from "./editorial.module.scss";

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
  return (
    <header data-navigation-hero className={`${styles.hero} ${compact ? styles.heroCompact : ""} ${variant === "article" ? styles.heroArticle : ""} ${image ? styles.heroWithImage : ""}`}>
      {image && <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={styles.heroImage} />}
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroContent}>
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
  return (
    <section id={id} className={`${styles.section} ${styles[`tone${tone}`]} ${className}`}>
      <div className={styles.sectionInner}>
        {(title || description) && (
          <div className={styles.sectionHeading}>
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
  onClick?: () => void;
  expanded?: boolean;
  controlLabel?: string;
  children?: React.ReactNode;
};

export function EditorialRow({ index, eyebrow, title, description, meta, image, imageAlt = "", href, onClick, expanded, controlLabel, children }: EditorialRowProps) {
  const reduceMotion = useReducedMotion();
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
      <span className={styles.rowArrow} aria-hidden="true">{href ? "↗" : expanded ? "−" : "+"}</span>
    </>
  );

  return (
    <article className={`${styles.row} ${expanded ? styles.rowExpanded : ""}`}>
      {href ? (
        <Link href={href} onClick={onClick} className={styles.rowControl}>{content}</Link>
      ) : (
        <button type="button" onClick={onClick} aria-expanded={expanded} aria-label={controlLabel} className={styles.rowControl}>{content}</button>
      )}
      <AnimatePresence initial={false}>
        {children && (
          <m.div
            key="row-detail"
            className={styles.rowDetailMotion}
            initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0.82 }}
            animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </article>
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
