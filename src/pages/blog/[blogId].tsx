import React from "react";
import SearchEnggOp from "../../elements/seoUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faPinterest,
  faTwitter,
  faFacebook,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../layouts/mainLayout";
import { CategoryList } from "../../elements/categoryList";
import Utils from "../../elements/utils";
import ReactMarkdown from 'react-markdown';
import BlogInterface from "../../interfaces/blogInterface";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { groupBy, sampleSize, sortBy } from "lodash";
import { QuoteInterface } from "@/elements/quoteSection";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { readdirSync } from "fs";



interface BlogTemplateInterface {
  siteDetails: {
    author: string,
    url: string
  }
  next: { relativeDirectory: string },
  previous: { relativeDirectory: string },
  current: {
    childMarkdownRemark: BlogInterface
  }
}


const BlogTemplate = ({ location, currentBlog, quote }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const pageTitle = `${currentBlog.childMarkdownRemark.frontmatter.title} by NK`;
  const shareProps = {
    url: "/",
    title: pageTitle,
  };
  return (
    <Layout location={location} quote={quote}>
      <SearchEnggOp title={currentBlog.childMarkdownRemark.frontmatter.title} />
      <article className="blog-single has-bottom-sep">
        <div
          className="page-header  bg-fixed bg-center bg-no-repeat text-center"
          style={{
            // backgroundImage: `url(${Utils.getFrontmatter(pageContext.current).img.childImageSharp.original.src})`,
            backgroundSize: "cover",
          }}
        >
          <div className="container mx-auto page-header__content ">
            <article className="w-full">
              <div className="page-header__info">
                <div className="page-header__cat">
                  <CategoryList
                    categories={
                      currentBlog.childMarkdownRemark.frontmatter.category
                    }
                  />
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {currentBlog.childMarkdownRemark.frontmatter.title}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">
                  <b>Nirmal Khedkar</b> on
                  {` ${currentBlog.childMarkdownRemark.frontmatter.date}`}
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div className=" m-auto" style={{ paddingBottom: "72px" }}>
          <div className="w-full pl-24 pr-24">
            <ReactMarkdown>
              {currentBlog.content}
            </ReactMarkdown>
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={currentBlog.childMarkdownRemark.frontmatter.category}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faTwitter}
                />
              </TwitterShareButton>
              <LinkedinShareButton
                source={"/"}
                summary={currentBlog.childMarkdownRemark.frontmatter.title}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faLinkedin}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                hashtag={`#${currentBlog.childMarkdownRemark.frontmatter.category}`}
                quote={`${currentBlog.childMarkdownRemark.frontmatter.title} by Nirmal Khedkar`}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faFacebook}
                />
              </FacebookShareButton>
              <PinterestShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faPinterest}
                />
              </PinterestShareButton>
              <WhatsappShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faWhatsapp}
                />
              </WhatsappShareButton>
              <TelegramShareButton
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faTelegram}
                />
              </TelegramShareButton>
              <EmailShareButton
                body="I found this interesting blog article that you might like:"
                subject="Check out this blog on nirmalhk7.tech"
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faEnvelope}
                />
              </EmailShareButton>
              <p
                className="blog-content__tags"
                style={{ marginTop: "3rem!important" }}
              >
                <span>
                  <CategoryList
                    categories={currentBlog.childMarkdownRemark.frontmatter.category}
                  />
                </span>
                <span className="blog-content__tag-list">
                  {currentBlog.childMarkdownRemark.frontmatter.tags.map((element, index) => (
                    <a href="#0" key={index}>
                      {element}
                    </a>
                  ))}
                </span>
              </p>
              <div className="blog-content__nav">
                {/* {pageContext.previous ? (
                  <div className="blog-content__prev">
                    <Link
                      className="no-underline"
                      rel="prev"
                      href={`/blog/${pageContext.previous.relativeDirectory}`}
                    >
                      <span>Previous Post</span>
                      {Utils.getFrontmatter(pageContext.previous).title}
                    </Link>
                  </div>
                ) : null}
                {pageContext.next ? (
                  <div className="blog-content__next">
                    <Link
                      rel="next"
                      href={`/blog/${pageContext.next.relativeDirectory}`}
                    >
                      <span>Next Post</span>
                      {Utils.getFrontmatter(pageContext.next).title}
                    </Link>
                  </div>
                ) : null} */}
              </div>
              <div className="blog-content__all">
                <Link className="btn btn--primary" href="/blog">
                  View All Posts
                </Link>
              </div>
              <hr />

            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          blogId: 'conclave',
        },
      }, // See the "paths" section below
    ],
    fallback: false, // false or "blocking"
  }
}

export const getStaticProps: GetStaticProps<any> = async (context) => {
  const allQuotesYaml: QuoteInterface[] = require("../../../content/yml/quotes.yaml");
  const blogId= context.params && context.params.blogId;
  const currentBlog= loadMarkdownFile("content/blog/"+blogId+".md",blogId, {getContent: true})
  
  let blogDetail= loadMarkdownFiles("content/blog",{getContent: true, getExcerpt: true});
  // context.params.blogId
 
  blogDetail= sortBy(blogDetail, blog=>blog.childMarkdownRemark.frontmatter.date);
  return { props: { currentBlog, 
  quote: sampleSize(allQuotesYaml)[0], blogDetail}}
}

export default BlogTemplate;
