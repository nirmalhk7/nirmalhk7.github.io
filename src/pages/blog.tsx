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
import blogWallpaper from "@/assets/images/datacenter.jpg";
import { sortBy } from "lodash";

interface BlogPageProps extends DefaultPageProps {
  blogs: BlogInterface[];
  blogsMiniInformation: BlogMiniInterface[];
}

const Blog = ({ blogs, blogsMiniInformation }: BlogPageProps) => {
  return (
    <main>
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
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");

  const blogDetail = sortBy(
    loadMarkdownFiles("content/blog", {
      getContent: true,
      getExcerpt: true,
    }),
    (o) => o.frontmatter.date
  ).reverse();

  const miniBlogInformation = blogDetail.map((blog) => ({
    ...blog,
    content: "",
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
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/blog`,
            images: [
              {
                url: `https://nirmalhk7.com${blogWallpaper.src}`,
                alt: "Hi, I'm Nirmal Khedkar",
                width: 900,
                height: 800,
              },
            ],
          },
          twitter: {
            site: `https://nirmalhk7.com/blog`,
          },
        },
      },
    },
  };
};
export default Blog;
