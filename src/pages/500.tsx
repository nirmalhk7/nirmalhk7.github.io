import Link from "next/link";
import { GetStaticProps } from "next";
import React from "react";

import { DefaultPageProps } from "./_app";
import { PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";

const ServerErrorPage = () => (
  <main className={styles.page}>
    <PageHero eyebrow="500 / Server error" title="Something went wrong." description="The server could not complete this request. Try again or return to the homepage.">
      <Link href="/">Return home <span aria-hidden="true">↗</span></Link>
    </PageHero>
    <PageSection eyebrow="Still looking?" title="Explore the work.">
      <div className={styles.errorLinks}>
        <Link href="/projects">Projects ↗</Link>
        <Link href="/blog">Writing ↗</Link>
      </div>
    </PageSection>
  </main>
);

export const getStaticProps: GetStaticProps<DefaultPageProps> = async () => ({
  props: {
    pageMetadata: {
      enableWrap: true,
      seoMetadata: {
        title: "Server Error",
        description: "The server could not complete this request.",
        noindex: true,
        nofollow: true,
      },
    },
  },
});

export default ServerErrorPage;
