import React from "react";

import Layout from "../layouts/mainLayout";
import SearchEnggOp from "../elements/seoUtil";
import LatestBlogItem from "../elements/latestBlogSection";
import MasonPanel from "../elements/blogListSection";
import Jumbotron from "../elements/jumbotron";
import Utils  from "../elements/utils";
import { GetStaticProps } from "next";
import sampleSize from "lodash/sampleSize";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import Link from "next/link";
import { readdirSync } from "fs";
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
    <Layout location={location} quote={quote}>
      <SearchEnggOp title="Pitlane Chat" />
      <Jumbotron.Max
        HeadingTextComponent={
          <h1 className="page-header__title">
            <Link title="" href="/blog">
              Pitlane Chat
            </Link>
          </h1>
        }
        bgImg="bg-blogWallpaper"
        buttonDetails={[["Explore", "#blog-first"]]}
        orangeText="Official Blog of Nirmal Khedkar"
      />
      <LatestBlogItem
        frontmatter={blogs[0].childMarkdownRemark.frontmatter}
        relativeDirectory={blogs[0].relativeDirectory}
      />
      <MasonPanel
        blogItems={blogs}
        sitename="Pitlane Chat"
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");

  const blogDetail= readdirSync("content/blog").map(blogName=>{
    return {relativeDirectory: blogName, ...loadMarkdownFile("content/blog/"+blogName+"/index.md",blogName)};
  });
  
  return { props: { blogs: blogDetail, quote: sampleSize(allQuotesYaml)[0]}}
}  
export default Blog;
