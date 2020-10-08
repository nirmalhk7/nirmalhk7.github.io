import React from "react";
import Navbar from "./components/partials/navbar";
import RandomQuote from "./components/partials/quote";
import Footer from "./components/partials/footer";
import SEO from "./components/seo";
import { graphql } from "gatsby";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin, faPinterest, faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";

const BlogTemplate = ({ data }) => {
  data = data.file;
  let postDate = data.relativeDirectory.split("-").slice(0, 3).join("-");
  data = data.childMarkdownRemark;
  return (
    <>
      <Navbar />
      <SEO title={data.frontmatter.title} />
      <article className="blog-single has-bottom-sep">
        <div
          className="page-header page-header--single page-hero parallax"
          style={{
            backgroundImage: `url(${data.frontmatter.img.childImageSharp.original.src})`,
            backgroundSize: "cover",
          }}
        >
          <div className="row page-header__content narrow">
            <article className="col-full">
              <div className="page-header__info">
                <div className="page-header__cat">
                  <a href="/categories/#Future">{data.frontmatter.category ? data.frontmatter.category : "Personal"}</a>
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {data.frontmatter.title}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">
                  {moment(postDate, "YYYY-MM-DD").format("MMMM DD, YYYY")} by &nbsp;
                  <b>Nirmal Khedkar</b>
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div className="row blog-content" style={{ paddingBottom: "72px" }}>
          <div className="col-full blog-content__main">
            <div className="blogpost" dangerouslySetInnerHTML={{ __html: data.html }} />
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase" style={{ marginTop: 0 }}>
                Spread the Love
              </h6>
              <a
                href={`todo`}
              >
                <FontAwesomeIcon icon={faFacebook} className="blog-social" />
              </a>
              <a
                href={`todo`}
              >
                <FontAwesomeIcon icon={faTwitter} className="blog-social" />
              </a>
              <a href="#0">
                <FontAwesomeIcon icon={faPinterest} className="blog-social" />
              </a>
              <a href="#0">
                <FontAwesomeIcon icon={faLinkedin} className="blog-social" />
              </a>
              <p className="blog-content__tags" style={{ marginTop: "3rem!important" }}>
                <span>
                  <a href="/categories/#Future">{data.frontmatter.category ? data.frontmatter.category : "Personal"}</a>
                </span>
                <span className="blog-content__tag-list">
                  {data.frontmatter.tags &&
                    data.frontmatter.tags.split(" ").map((element, index) => (
                      <a key={index} href="#0">
                        {element}
                      </a>
                    ))}
                </span>
              </p>
              <div className="blog-content__all">
                <a href="/blog" className="btn btn--primary">
                  View All Post
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
      <RandomQuote />
      <Footer />
    </>
  );
};
// 5ddb4f0e-b206-5442-90ff-32f99a5218cc
export const postQuery = graphql`
  query($pathSlug: String!) {
    file(childMarkdownRemark: { id: { eq: $pathSlug } }) {
      childMarkdownRemark {
        frontmatter {
          img {
            childImageSharp {
              original {
                src
              }
            }
          }
          description
          category
          title
          tags
        }
        html
      }
      relativeDirectory
    }
  }
`;

export default BlogTemplate;
