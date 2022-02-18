import React from "react";
import SearchEnggOp from "../components/seo";
import Link from "../components/partials/link";
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
import Layout from "../components/layout";
import { CategoryList } from "../helper/category";
import Commento from "../components/commento";

const BlogTemplate = ({ location, pageContext }) => {
  const pageTitle = `${pageContext.current.frontmatter.title} by ${pageContext.siteDetails.author}`;
  const shareProps = {
    url: pageContext.siteDetails.url + location.pathname,
    title: pageTitle,
  };
  return (
    <Layout location={location}>
      <SearchEnggOp title={pageContext.current.frontmatter.title} />
      <article className="blog-single has-bottom-sep">
        <div
          className="page-header page-header--single page-hero parallax"
          style={{
            backgroundImage: `url(${pageContext.current.frontmatter.img.childImageSharp.original.src})`,
            backgroundSize: "cover",
          }}
        >
          <div className="m-auto page-header__content narrow">
            <article className="col-12">
              <div className="page-header__info">
                <div className="page-header__cat">
                  <CategoryList
                    categories={pageContext.current.frontmatter.category}
                  />
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {pageContext.current.frontmatter.title}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">
                  <b>Nirmal Khedkar</b> on
                  {` ${pageContext.current.frontmatter.date}`}
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div
          className="row blog-content m-auto"
          style={{ paddingBottom: "72px" }}
        >
          <div className="col-12 blog-content__main">
            <div
              className="blogpost"
              dangerouslySetInnerHTML={{
                __html: pageContext.current.html,
              }}
              style={{ marginTop: "2em" }}
            />
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={pageContext.current.frontmatter.category}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faTwitter}
                />
              </TwitterShareButton>
              <LinkedinShareButton
                source={location.href}
                summary={pageContext.current.frontmatter.title}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faLinkedin}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                hashtag={`#${pageContext.current.frontmatter.category}`}
                quote={`${pageContext.current.frontmatter.title} by Nirmal Khedkar`}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faFacebook}
                />
              </FacebookShareButton>
              <PinterestShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faPinterest}
                />
              </PinterestShareButton>
              <WhatsappShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faWhatsapp}
                />
              </WhatsappShareButton>
              <TelegramShareButton
                title={`${pageContext.current.frontmatter.title} by Nirmal Khedkar`}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faTelegram}
                />
              </TelegramShareButton>
              <EmailShareButton
                body="I found this interesting blog article that you might like:"
                subject="Check out this blog on nirmalhk7.tech"
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faEnvelope}
                />
              </EmailShareButton>
              <p
                className="blog-content__tags"
                style={{ marginTop: "3rem!important" }}
              >
                <span>
                  <CategoryList
                    categories={pageContext.current.frontmatter.category}
                  />
                </span>
                <span className="blog-content__tag-list">
                  {pageContext.current.frontmatter.tags.map(
                    (element, index) => (
                      <a href="#0" key={index}>
                        {element}
                      </a>
                    )
                  )}
                </span>
              </p>
              <div className="blog-content__nav">
                {pageContext.previous ? (
                  <div className="blog-content__prev">
                    <Link
                      className="text-decoration-none"
                      rel="prev"
                      to={`/blog/${pageContext.previous.relativeDirectory}`}
                    >
                      <span>Previous Post</span>
                      {pageContext.previous.frontmatter.title}
                    </Link>
                  </div>
                ) : null}
                {pageContext.next ? (
                  <div className="blog-content__next">
                    <Link
                      rel="next"
                      to={`/blog/${pageContext.next.relativeDirectory}`}
                    >
                      <span>Next Post</span>
                      {pageContext.next.frontmatter.title}
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="blog-content__all">
                <a className="btn btn--primary" href="/blog">
                  View All Posts
                </a>
              </div>
              <hr />

              <Commento id={location.href} />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogTemplate;
