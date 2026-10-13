import React from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { EditorialRow, PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";

const DesignPage: React.FC = () => (
  <main className={styles.page}>
    <PageHero
      eyebrow="Design system / Shared components"
      title="One system, across the stack."
      description="Outfit headlines, Plex Mono labels, warm paper, deep ink, and vermilion connect the controls, section rhythm, and content patterns on this site."
      compact
    >
      <Link href="/projects">See the project archive <span aria-hidden="true">↗</span></Link>
    </PageHero>
    <PageSection eyebrow="Interface foundations" title="Quiet structure. Clear actions." description="Warm paper, ink, and vermilion carry a consistent visual language across every route.">
      <div className={styles.filterBar} aria-label="Button examples">
        <span className={`${styles.filterButton} ${styles.filterButtonActive}`}>Selected control example</span>
        <span className={styles.filterButton}>Secondary control example</span>
        <Link href="/resume" className={styles.action}>Open résumé ↗</Link>
      </div>
      <EditorialRow
        index={0}
        eyebrow="Reusable content row"
        title="A shared pattern for projects and writing."
        description="The same spacing, hierarchy, metadata, and interaction cues appear in the project archive, article list, and case details."
        meta="Pattern 01"
        href="/blog"
      />
    </PageSection>
    <PageSection tone="ink" eyebrow="Palette" title="Paper. Ink. Vermilion." description="A small color set keeps attention on the work and the people behind it.">
      <ul className={styles.tagList}>
        <li>Paper · #F5F2EB</li><li>Ink · #202321</li><li>Night · #19211F</li><li>Vermilion · #C43B31</li><li>Muted · #565C58</li>
      </ul>
    </PageSection>
  </main>
);

export default DesignPage;

export const getStaticProps: GetStaticProps<DefaultPageProps> = async () => ({
  props: {
    pageMetadata: {
      enableWrap: true,
      seoMetadata: {
        title: "Site Design System",
        description: "Shared visual components and design tokens used across Nirmal Khedkar's portfolio.",
        noindex: true,
        nofollow: true,
      },
    },
  },
});
