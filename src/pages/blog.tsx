
import React from "react";
import LatestBlogSection from "@/components/Blog/latestBlogSection";
import BlogListSection from "@/components/Blog/blogListSection";
import Link from "next/link";
import { PageHero, editorialStyles as styles } from "@/components/Site/Editorial";
import { GetStaticProps } from "next";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { DefaultPageProps } from "./_app";
import { BlogFrontmatterInterface, BlogInterface, BlogMiniInterface } from "@/interfaces/blog";
import blogWallpaper from "@/assets/images/datacenter.jpg";
import sortBy from "lodash/sortBy";
import { openGraphImage } from "@/util/openGraph";

interface BlogPageProps extends DefaultPageProps {
  blogs: BlogInterface[];
  blogsMiniInformation: BlogMiniInterface[];
}

const Blog = ({ blogs, blogsMiniInformation }: BlogPageProps) => {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "The Blue Green Manual",
    "description": "Practical articles by Nirmal Khedkar about production engineering, homelabs, Kubernetes, GitOps, infrastructure reliability, and software systems.",
    "url": "https://nirmalhk7.com/blog",
    "hasPart": blogsMiniInformation.map((blog) => ({
      "@type": "BlogPosting",
      "headline": blog.frontmatter?.title || "",
      "description": blog.excerpt || blog.frontmatter?.description || "",
      "url": `https://nirmalhk7.com/blog/${blog.slug}`,
      "datePublished": blog.frontmatter?.date || "",
      "author": {
        "@type": "Person",
        "name": "Nirmal Khedkar",
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nirmalhk7.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://nirmalhk7.com/blog",
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        eyebrow="Writing / The Blue Green Manual"
        title="Notes from the work."
        description="Field notes on backend systems, infrastructure, homelabs, and the decisions behind them."
        image={blogWallpaper}
        imageAlt="Rows of servers in a data center"
      >
        <Link href="#blog-first">Explore the writing <span aria-hidden="true">↓</span></Link>
      </PageHero>
      <LatestBlogSection
        frontmatter={blogs[0].frontmatter}
        excerpt={blogs[0].excerpt}
        slug={blogs[0].slug}
      />
      <BlogListSection blogItems={blogsMiniInformation} />
    </main>
  );
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const blogDetail = sortBy(
    loadMarkdownFiles<BlogFrontmatterInterface>("content/blog", {
      getContent: true,
      getExcerpt: true,
    }),
    (o) => o.frontmatter.date
  ).reverse();

  const miniBlogInformation = blogDetail.map((blog) => ({
    ...blog,
    content: "",
    excerpt: blog.frontmatter.description || blog.excerpt || "",
  }));
  return {
    props: {
      blogs: blogDetail,
      blogsMiniInformation: miniBlogInformation,
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "The Blue Green Manual",
          description:
            "Practical articles by Nirmal Khedkar about production engineering, homelabs, Kubernetes, GitOps, infrastructure reliability, and software systems.",
          canonical: "https://nirmalhk7.com/blog",
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/blog`,
            images: [openGraphImage("Notes from the work.", "The Blue Green Manual. Systems, homelabs, and lessons learned.", "writing")],
          },
        },
      },
    },
  };
};
export default Blog;
