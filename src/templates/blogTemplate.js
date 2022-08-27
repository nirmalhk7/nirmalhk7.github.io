import React from "react";
import SearchEnggOp from "../elements/seo";
import { Link } from "gatsby";
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
import Layout from "../layouts/mainLayout";
import { CategoryList } from "../elements/category";
import Commento from "../elements/commento";
import { getItem } from "../elements/util";
import ReactSafelySetInnerHTML from 'react-safely-set-inner-html';

const BlogTemplate = ({ location, pageContext }) => {
  const pageTitle = `${getItem(pageContext.current).title} by ${pageContext.siteDetails.author
    }`;
  const shareProps = {
    url: pageContext.siteDetails.url + location.pathname,
    title: pageTitle,
  };
  return (
    <Layout location={location}>
      <SearchEnggOp title={getItem(pageContext.current).title} />
      <article className="blog-single has-bottom-sep">
        <div
          className="page-header pt-64 pb-32 text-center  bg-fixed bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getItem(pageContext.current).img.childImageSharp.original.src})`,
            backgroundSize: "cover",
          }}
        >
          <div className="m-auto page-header__content narrow">
            <article className="w-full">
              <div className="page-header__info">
                <div className="page-header__cat">
                  <CategoryList
                    categories={
                      getItem(pageContext.current)
                        .category
                    }
                  />
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {getItem(pageContext.current).title}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">
                  <b>Nirmal Khedkar</b> on
                  {` ${getItem(pageContext.current).date}`}
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div className=" m-auto" style={{ paddingBottom: "72px" }}>
          <div className="w-full pl-24 pr-24">
            <ReactSafelySetInnerHTML>
              {pageContext.current.childMarkdownRemark.html}
            </ReactSafelySetInnerHTML>
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={getItem(pageContext.current).category}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faTwitter}
                />
              </TwitterShareButton>
              <LinkedinShareButton
                source={location.href}
                summary={getItem(pageContext.current).title}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="mr-2 text-accent"
                  icon={faLinkedin}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                hashtag={`#${getItem(pageContext.current).category}`}
                quote={`${getItem(pageContext.current).title
                  } by Nirmal Khedkar`}
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
                title={`${getItem(pageContext.current).title
                  } by Nirmal Khedkar`}
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
                    categories={getItem(pageContext.current).category}
                  />
                </span>
                <span className="blog-content__tag-list">
                  {getItem(pageContext.current).tags.map((element, index) => (
                    <a href="#0" key={index}>
                      {element}
                    </a>
                  ))}
                </span>
              </p>
              <div className="blog-content__nav">
                {pageContext.previous ? (
                  <div className="blog-content__prev">
                    <Link
                      className="no-underline"
                      rel="prev"
                      to={`/blog/${pageContext.previous.relativeDirectory}`}
                    >
                      <span>Previous Post</span>
                      {getItem(pageContext.previous).title}
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
                      {pageContext.next.childMarkdownRemark.frontmatter.title}
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
