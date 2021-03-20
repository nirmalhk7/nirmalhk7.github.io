import React from "react";
import SEO from "../components/seo";
import { graphql, Link } from "gatsby";
import moment from "moment";
import { Disqus } from "gatsby-plugin-disqus";
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
const BlogTemplate = ({ location, pageContext }) => {
  const pageTitle = pageContext.current.childMarkdownRemark.frontmatter.title + " by " + pageContext.siteDetails.author;
  const shareProps = {
    url: pageContext.siteDetails.url + location.pathname,
    title: pageTitle,
  };
  return (
    <Layout location={location}>
      <SEO title={pageContext.current.childMarkdownRemark.frontmatter.title} />
      <article className="blog-single has-bottom-sep">
        <div
          className="page-header page-header--single page-hero parallax"
          style={{
            backgroundImage: `url(${pageContext.current.childMarkdownRemark.frontmatter.img.childImageSharp.original.src})`,
            backgroundSize: "cover",
          }}
        >
          <div className="m-auto page-header__content narrow">
            <article className="col-12">
              <div className="page-header__info">
                <div className="page-header__cat">
                  <CategoryList categories={pageContext.current.childMarkdownRemark.frontmatter.category} />
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {pageContext.current.childMarkdownRemark.frontmatter.title}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">
                  <b>Nirmal Khedkar</b> on
                  {" " + pageContext.current.childMarkdownRemark.frontmatter.date}
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div className="row blog-content m-auto" style={{ paddingBottom: "72px" }}>
          <div className="col-12 blog-content__main">
            <div
              className="blogpost"
              style={{ marginTop: "2em" }}
              dangerouslySetInnerHTML={{
                __html: pageContext.current.childMarkdownRemark.html,
              }}
            />
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={pageContext.current.childMarkdownRemark.frontmatter.category}
                {...shareProps}
              >
                <FontAwesomeIcon icon={faTwitter} className="blog-social anchor-color" />
              </TwitterShareButton>
              <LinkedinShareButton
                summary={pageContext.current.childMarkdownRemark.frontmatter.title}
                source={location.href}
                {...shareProps}
              >
                <FontAwesomeIcon icon={faLinkedin} className="blog-social anchor-color" />
              </LinkedinShareButton>
              <FacebookShareButton
                quote={pageContext.current.childMarkdownRemark.frontmatter.title + " by Nirmal Khedkar"}
                hashtag={"#" + pageContext.current.childMarkdownRemark.frontmatter.category}
                {...shareProps}
              >
                <FontAwesomeIcon icon={faFacebook} className="blog-social anchor-color" />
              </FacebookShareButton>
              <PinterestShareButton {...shareProps}>
                <FontAwesomeIcon icon={faPinterest} className="blog-social anchor-color" />
              </PinterestShareButton>
              <WhatsappShareButton {...shareProps}>
                <FontAwesomeIcon icon={faWhatsapp} className="blog-social anchor-color" />
              </WhatsappShareButton>
              <TelegramShareButton
                title={pageContext.current.childMarkdownRemark.frontmatter.title + " by Nirmal Khedkar"}
                {...shareProps}
              >
                <FontAwesomeIcon icon={faTelegram} className="blog-social anchor-color" />
              </TelegramShareButton>
              <EmailShareButton
                subject="Check out this blog on nirmalhk7.tech"
                body="I found this interesting blog article that you might like:"
                {...shareProps}
              >
                <FontAwesomeIcon icon={faEnvelope} className="blog-social anchor-color" />
              </EmailShareButton>
              <p className="blog-content__tags" style={{ marginTop: "3rem!important" }}>
                <span>
                  <CategoryList categories={pageContext.current.childMarkdownRemark.frontmatter.category} />
                </span>
                <span className="blog-content__tag-list">
                  {pageContext.current.childMarkdownRemark.frontmatter.tags.map((element, index) => (
                    <a key={index} href="#0">
                      {element}
                    </a>
                  ))}
                </span>
              </p>
              <div className="blog-content__nav">
                {pageContext.previous ? (
                  <div className="blog-content__prev">
                    <Link to={"/blog/" + pageContext.previous.relativeDirectory} rel="prev">
                      <span>Previous Post</span>
                      {pageContext.previous.childMarkdownRemark.frontmatter.title}
                    </Link>
                  </div>
                ) : null}
                {pageContext.next ? (
                  <div className="blog-content__next">
                    <Link to={"/blog/" + pageContext.next.relativeDirectory} rel="next">
                      <span>Next Post</span>
                      {pageContext.next.childMarkdownRemark.frontmatter.title}
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="blog-content__all">
                <a href="/blog" className="btn btn--primary">
                  View All Posts
                </a>
              </div>
              <hr />
              {/* <Disqus
                config={{
                  url: location.href,
                  identifier: location.href,
                  title: pageTitle,
                }}
              /> */}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogTemplate;
