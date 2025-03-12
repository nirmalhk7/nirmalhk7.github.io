import React from "react";

import LatestBlogSection from "@/components/Blog/latestBlogSection";
import BlogListSection from "@/components/Blog/blogListSection";
import Jumbotron from "../elements/jumbotron";
import { GetStaticProps } from "next";
import sampleSize from "lodash/sampleSize";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import Link from "next/link";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { DefaultPageProps } from "./_app";

interface BlogPageProps extends DefaultPageProps {
  blogs: {
    id: string;
    childMarkdownRemark: { frontmatter: any };
    content: string | null;
    excerpt: string | null | undefined;
    slug: string;
  }[];
}

const Blog = ({ blogs, location, data, quote }: any) => {
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
        frontmatter={blogs[0].childMarkdownRemark.frontmatter}
        relativeDirectory={blogs[0].slug}
      />
      <BlogListSection blogItems={blogs} />
    </main>
  );
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");

  const blogDetail = loadMarkdownFiles("content/blog", {
    getContent: true,
    getExcerpt: true,
  });

  return {
    props: {
      blogs: blogDetail,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "The Blue Green Manual",
          description: "Dwelving into Production Scale Engineering with Nirmal Khedkar. This is The Blue Green Manual",
        },
      },
    },
  };
};
export default Blog;
