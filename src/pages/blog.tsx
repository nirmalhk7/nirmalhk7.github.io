import React from "react";

import LatestBlogSection from "@/components/Blog/latestBlogSection";
import BlogListSection from "@/components/Blog/blogListSection";
import Jumbotron from "../elements/jumbotron";
import { GetStaticProps } from "next";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { DefaultPageProps } from "./_app";
import { BlogFrontmatterInterface, BlogInterface, BlogMiniInterface } from "@/interfaces/blog";
import blogWallpaper from "@/assets/images/datacenter.jpg";
import sortBy from "lodash/sortBy";
import { loadRandomQuote } from "@/util/loadQuote";

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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Jumbotron.Max
        HeadingTextComponent={
          <h1 className="page-header__title text-white">
            The Blue Green Manual
          </h1>
        }
        bgImg={blogWallpaper}
        buttonDetails={[["Explore", "#blog-first"]]}
        orangeText="The Official Blog of Nirmal Khedkar"
      />
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
      quote: loadRandomQuote(),
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
            images: [
              {
                url: "https://nirmalhk7.com/assets/datacenter.jpg",
                alt: "Hi, I'm Nirmal Khedkar",
                width: 1200,
                height: 630,
              },
            ],
          },
        },
      },
    },
  };
};
export default Blog;
