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
import BlogInterface from "@/interfaces/blog";
import Link from "next/link";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { sampleSize } from "lodash";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { DefaultPageProps } from "../_app";
import Jumbotron from "@/elements/jumbotron";
import { ProjectDescription } from "@/components/Project/projectDescription";

interface BlogTemplatePageProps extends DefaultPageProps {
  current: BlogInterface;
}

const BlogTemplate = ({
  current,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // TODO NK: Fix needed here: appropriate representation
  const shareProps = {
    url: "/",
    title: current.frontmatter?.title,
    className: "py-4"
  };

  const shareIcons = "mr-5 my-5  text-accent text-5xl"

  return (
    <main>
      <article className="blog-single has-bottom-sep">
        <Jumbotron.mini
          backgroundImage={nasaGalaxy}
          backgroundImageAlt="Earth from Space"
          title={current.frontmatter.title}
          subtitle=""
          DescriptionComponent={() => (
            <div className="page-header__info">
              <div className="page-header__cat">
                {current.frontmatter.category.map((category: string) => (
                  <React.Fragment key={category}>
                    <Link
                      className="text-white no-underline uppercase"
                      href={`/blog#${category}`}
                    >
                      {category}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        />
        <div className="container mx-auto pt-20">
          <div className="w-full">
            <ReactMarkdown>{current.content || ""}</ReactMarkdown>
            <div className="relative border-y-2 border-gray-100 mt-10 py-10">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={current.frontmatter?.tags}
                url="/"
                title={current.frontmatter.title}
                className="hover:shadow-none"
              >
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faTwitter}
                />
              </TwitterShareButton>
              <LinkedinShareButton
                source={"/"}
                summary={current.frontmatter?.title}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faLinkedin}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                hashtag={`#${current.frontmatter?.category}`}
                quote={`${current.frontmatter?.title} by Nirmal Khedkar`}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faFacebook}
                />
              </FacebookShareButton>
              <PinterestShareButton {...shareProps}>
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faPinterest}
                />
              </PinterestShareButton>
              <WhatsappShareButton {...shareProps}>
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faWhatsapp}
                />
              </WhatsappShareButton>
              <TelegramShareButton {...shareProps}>
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faTelegram}
                />
              </TelegramShareButton>
              <EmailShareButton
                body="I found this interesting blog article that you might like:"
                subject="Check out this blog on nirmalhk7.com"
                {...shareProps}
              >
                <FontAwesomeIcon
                  className={shareIcons}
                  icon={faEnvelope}
                />
              </EmailShareButton>
              <p
                className="blog-content__tags"
              >
                <span></span>
                <span className="blog-content__tag-list">
                  {current.frontmatter?.tags.map((element, index) => (
                    <a href="#0" key={index}>
                      {element}
                    </a>
                  ))}
                </span>
              </p>
              <div className="blog-content__all">
                <Link className="button button-accent-fill" href="/blog">
                  View All Posts
                </Link>
              </div>
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
          title: currentBlog.frontmatter.title,
          description: "Blog by Nirmal Khedkar",
        },
      },
    },
  };
};

export default BlogTemplate;
