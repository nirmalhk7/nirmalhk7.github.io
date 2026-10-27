import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogMiniInterface } from "@/interfaces/blog";
import { trackSelectContent } from "@/util/analytics";
import { PageSection, editorialStyles as styles } from "@/components/Site/Editorial";

const LatestBlogSection = ({ frontmatter, excerpt, slug }: BlogMiniInterface) => (
    <PageSection id="blog-first" tone="ink">
      <div className={styles.featured}>
        <Link data-analytics-exposure={slug} data-analytics-skip-global="true"
          href={`/blog/${slug}`}
          prefetch={false}
          className={styles.featuredImage}
          aria-label={`Read ${frontmatter?.title || "the latest article"}`}
          onClick={() => {
            trackSelectContent("blog_post", slug, { item_list_name: "latest_blog" });
          }}
        >
          <Image src={frontmatter?.img || ""} alt={frontmatter?.title || "Article cover"} fill sizes="(max-width: 767px) 100vw, 48vw" />
        </Link>
        <div className={styles.featuredCopy}>
          <p className={styles.eyebrow}><time dateTime={frontmatter?.date}>{frontmatter?.date && new Date(frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></p>
          <h2>{frontmatter?.title}</h2>
          <p>{excerpt}</p>
          <Link href={`/blog/${slug}`} prefetch={false} className={styles.textLink}>Read the article <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </PageSection>
);

LatestBlogSection.displayName = "LatestBlogSection";
export default LatestBlogSection;
