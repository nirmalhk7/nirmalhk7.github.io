import React from "react";

import Layout from "../layouts/mainLayout";
import LatestBlogSection from "../elements/latestBlogSection";
import BlogListSection from "../elements/blogListSection";
import Jumbotron from "../elements/jumbotron";
import { GetStaticProps } from "next";
import sampleSize from "lodash/sampleSize";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import Link from "next/link";
import { QuoteInterface } from "@/elements/quoteSection";

type BlogPageTypes= {
  site: {
    siteMetadata: {
      blogName: string
    }
  }
  blogs: {
    nodes: {
      relativeDirectory: string,
      childMarkdownRemark: {
        frontmatter: any
      }
    }[]
  }
}

const Blog = ({ blogs, location, data, quote }: any) => {
  // if (!data) return null;
  return (
    <Layout location={location} quote={quote} metadata={{title:"The Blue Green Manual", description:"I love writing about my opinions and general topics. Follow in."}}>
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
      <BlogListSection
        blogItems={blogs}
        sitename="The Blue Green Manual"
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");

  const blogDetail= loadMarkdownFiles("content/blog",{getContent: true, getExcerpt: true});
  
  return { props: { blogs: blogDetail, quote: sampleSize(allQuotesYaml)[0]}}
}  
export default Blog;
