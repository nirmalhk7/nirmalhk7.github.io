import React from "react";
import Navbar from "./components/partials/navbar";
import RandomQuote from "./components/partials/quote";
import Footer from "./components/partials/footer";
import SEO from "./components/seo";
import { graphql, Link } from "gatsby";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faPinterest,
  faTwitter,
  faFacebook,
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
import Layout from "./components/layout";
import { CategoryList } from "./helper/category";
const BlogTemplate = ({ pageContext }) => {
  return (
    <>
      <Layout>
        <SEO
          title={pageContext.current.childMarkdownRemark.frontmatter.title}
        />
        <article className="blog-single has-bottom-sep">
          <div
            className="page-header page-header--single page-hero parallax"
            style={{
              backgroundImage: `url(${pageContext.current.childMarkdownRemark.frontmatter.img.childImageSharp.original.src})`,
              backgroundSize: "cover",
            }}
          >
            <div className="row page-header__content narrow">
              <article className="col-full">
                <div className="page-header__info">
                  <div className="page-header__cat">
                    <CategoryList
                      categories={
                        pageContext.current.childMarkdownRemark.frontmatter
                          .category
                      }
                    />
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
                    {" "+pageContext.current.childMarkdownRemark.frontmatter.date}
                  </li>
                </ul>
              </article>
            </div>
          </div>
          <div className="row blog-content" style={{ paddingBottom: "72px" }}>
            <div className="col-full blog-content__main">
              <div
                className="blogpost"
                dangerouslySetInnerHTML={{
                  __html: pageContext.current.childMarkdownRemark.html,
                }}
              />
              <div className="blog-content__pagenav">
                <h6 className="boxfont text-uppercase" style={{ marginTop: 0 }}>
                  Spread the Love
                </h6>
                <a href={`todo`}>
                  <FontAwesomeIcon icon={faFacebook} className="blog-social" />
                </a>
                <a href={`todo`}>
                  <FontAwesomeIcon icon={faTwitter} className="blog-social" />
                </a>
                <a href="#0">
                  <FontAwesomeIcon icon={faPinterest} className="blog-social" />
                </a>
                <a href="#0">
                  <FontAwesomeIcon icon={faLinkedin} className="blog-social" />
                </a>
                <p
                  className="blog-content__tags"
                  style={{ marginTop: "3rem!important" }}
                >
                  <span>
                    <CategoryList
                      categories={
                        pageContext.current.childMarkdownRemark.frontmatter
                          .category
                      }
                    />
                  </span>
                  <span className="blog-content__tag-list">
                    {pageContext.current.childMarkdownRemark.frontmatter.tags.map(
                      (element, index) => (
                        <a key={index} href="#0">
                          {element}
                        </a>
                      )
                    )}
                  </span>
                </p>
                <div class="blog-content__nav">
                  {pageContext.previous ? (
                    <div class="blog-content__prev">
                      <Link
                        to={"/blog/" + pageContext.previous.relativeDirectory}
                        rel="prev"
                      >
                        <span>Previous Post</span>
                        {
                          pageContext.previous.childMarkdownRemark.frontmatter
                            .title
                        }
                      </Link>
                    </div>
                  ) : null}
                  {pageContext.next ? (
                    <div class="blog-content__next">
                      <Link
                        to={"/blog/" + pageContext.next.relativeDirectory}
                        rel="next"
                      >
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
              </div>
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
};
// 5ddb4f0e-b206-5442-90ff-32f99a5218cc
// export const postQuery = graphql`
//   query($pathSlug: String!) {
//     file(childMarkdownRemark: { id: { eq: $pathSlug } }) {
//       childMarkdownRemark {
//         frontmatter {
//           img {
//             childImageSharp {
//               original {
//                 src
//               }
//             }
//           }
//           description
//           category
//           title
//           tags
//         }
//         html
//       }
//       relativeDirectory
//     }
//   }
// `;

export default BlogTemplate;
