import React from "react";
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
import ReactMarkdown from "react-markdown";
import BlogInterface from "@/interfaces/blogInterface";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { sampleSize } from "lodash";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { DefaultPageProps } from "../_app";

interface BlogTemplatePageProps extends DefaultPageProps {
  current: {
    id: string;
    childMarkdownRemark: {
      frontmatter?: {
        tags: string[],
        category: string,
        title: string
      };
    };
    content: string | null;
    excerpt: string | undefined | null;
    slug: string;
  };
}

const BlogTemplate = ({
  current
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // TODO NK: Fix needed here: appropriate representation
  const shareProps = {
    url: "/",
    title: current.childMarkdownRemark.frontmatter?.title,
  };

  return (
    <main>
      <article className="blog-single has-bottom-sep">
        <div
          className="page-header  bg-fixed bg-center bg-no-repeat text-center"
          style={{
            backgroundSize: "cover",
          }}
        >
          <div className="container mx-auto page-header__content ">
            <article className="w-full">
              <div className="page-header__info">
                <div className="page-header__cat">
                  {/* {current.childMarkdownRemark.frontmatter.category.map(
                    ({ category, index }: any) => (
                      <React.Fragment key={index}>
                        <a href={`/blog#${category}`}>{category}</a>
                        {current.childMarkdownRemark.frontmatter.category
                          .length !==
                        index + 1
                          ? ", "
                          : null}
                      </React.Fragment>
                    )
                  )} */}
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {/* {current.childMarkdownRemark.frontmatter.title} */}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">
                  <b>Nirmal Khedkar</b> on
                  {/* {` ${current.childMarkdownRemark.frontmatter.date}`} */}
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div className=" m-auto" style={{ paddingBottom: "72px" }}>
          <div className="w-full pl-24 pr-24">
            <ReactMarkdown>{current.content || ""}</ReactMarkdown>
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={current.childMarkdownRemark.frontmatter?.tags}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faTwitter}
                />
              </TwitterShareButton>
              <LinkedinShareButton
                source={"/"}
                summary={current.childMarkdownRemark.frontmatter?.title}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faLinkedin}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                hashtag={`#${current.childMarkdownRemark.frontmatter?.category}`}
                quote={`${current.childMarkdownRemark.frontmatter?.title} by Nirmal Khedkar`}
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
              <TelegramShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faTelegram}
                />
              </TelegramShareButton>
              <EmailShareButton
                body="I found this interesting blog article that you might like:"
                subject="Check out this blog on nirmalhk7.com"
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
                </span>
                <span className="blog-content__tag-list">
                  {current.childMarkdownRemark.frontmatter?.tags.map(
                    (element, index) => (
                      <a href="#0" key={index}>
                        {element}
                      </a>
                    )
                  )}
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
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = loadMarkdownFiles("content/blog", {
    getContent: false,
    getExcerpt: false,
  });

  const paths = blogs.map((file) => {
    return {
      params: {
        blogId: file.slug,
      },
    };
  });

  return {
    paths,
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<BlogTemplatePageProps> = async (
  context
) => {
  const allQuotesYaml: QuoteInterface[] = require("../../../content/yml/quotes.yaml");
  const blogId = context.params?.blogId as string;
  const currentBlog = loadMarkdownFile(
    "content/blog/" + blogId + ".md",
    blogId,
    { getContent: true }
  );

  return {
    props: {
      current: currentBlog,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          defaultTitle: "The Blue Green Manual",
          description: "Blog by Nirmal Khedkar",
        },
      },
    },
  };
};

export default BlogTemplate;