import React from "react";

import LatestBlogSection from "@/components/Blog/latestBlogSection";
import BlogListSection from "@/components/Blog/blogListSection";
import Jumbotron from "../elements/jumbotron";
import { GetStaticProps } from "next";
import sampleSize from "lodash/sampleSize";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import Link from "next/link";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { DefaultPageProps } from "./_app";
import { BlogInterface, BlogMiniInterface } from "@/interfaces/blog";

interface BlogPageProps extends DefaultPageProps {
  blogs: BlogInterface[];
  blogsMiniInformation: BlogMiniInterface[];
}

const Blog = ({ blogs, blogsMiniInformation }: BlogPageProps) => {
  return (
    <main>
      <Jumbotron.Max
        HeadingTextComponent={
          <h1 className="page-header__title">
            <Link title="" href="/blog">
              The Blue Green Manual
            </Link>
          </h1>
        }
        bgImg="bg-blogWallpaper"
        buttonDetails={[["Explore", "#blog-first"]]}
        orangeText="Official Blog of Nirmal Khedkar"
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
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");

  const blogDetail = loadMarkdownFiles("content/blog", {
    getContent: true,
    getExcerpt: true,
  });

  const miniBlogInformation = blogDetail.map((i) => ({
    childMarkdownRemark: i.childMarkdownRemark,
    excerpt: i.excerpt,
    slug: i.slug,
  }));
  return {
    props: {
      blogs: blogDetail,
      blogsMiniInformation: miniBlogInformation,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "The Blue Green Manual",
          description:
            "Dwelving into Production Scale Engineering with Nirmal Khedkar. This is The Blue Green Manual",
        },
      },
    },
  };
};
export default Blog;
