import React from "react";

import Layout from "../components/layout";
import SearchEnggOp from "../components/seo";
import { graphql, Link } from "gatsby";
import SocialMediaIcons from "../components/partials/social";
// import SocialMediaSideIcons from "../components/partials/social"

const LatestBlogItem = ({ item }) => {
  let srx = item.childMarkdownRemark.frontmatter.img;
  if (srx.childImageSharp !== null) {
    srx = {
      src: srx.childImageSharp.fixed.srcWebp,
      srcSet: srx.childImageSharp.fixed.srcSetWebp,
    };
  } else {
    srx = { src: srx.publicURL, srcSet: null };
  }
  return (
    <section
      className="s-works inv  bootstrap-wrapper"
      id="blog-first"
      style={{
        textDecoration:"none",
        paddingTop:"2em",
        paddingBottom:"2em"
      }}
    >
      <div className="container blog-content">
        <Link
          className="blog-list block-1-2 block-tab-full"
          style={{ marginTop: "0rem" }}
          to={`/blog/${item.relativeDirectory}`}
        >
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <img
                src={srx.src}
                srcSet={srx.srcSet}
                style={{ width:"70%", height:"auto" }}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12  text-md-right">
              <h1 className="entry-title"  style={{textDecoration:"none"}}>
                {item.childMarkdownRemark.frontmatter.title}
              </h1>
              <div className="entry-content"  style={{textDecoration:"none"}}>
                <p>{item.childMarkdownRemark.frontmatter.description}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

const MasonPanel = ({ sitename, blogItems }) => {
  return (
    <section className="blog-content-wrap">
      <div className="">
        <div className="blog-content m-auto" style={{ maxWidth: "1500px" }}>
          <div
            className="section-intro has-bottom-sep"
            style={{ paddingTop: "5em" }}
          >
            <div className="text-center">
              <h3>{sitename}</h3>
              <h1>All Posts</h1>
            </div>
          </div>
          <div className="blog-list block-1-2 block-tab-full">
            <div className="row">
              <div className="masonry">
                {blogItems.map((element, index) => {
                  let srx = element.childMarkdownRemark.frontmatter.img;
                  if (srx.childImageSharp !== null) {
                    srx = {
                      src: srx.childImageSharp.fixed.srcWebp,
                      srcSet: srx.childImageSharp.fixed.srcSetWebp,
                    };
                  } else {
                    srx = { src: srx.publicURL, srcSet: null };
                  }

                  return (
                    <div className="masonry__brick" key={index}>
                      <div className="item-folio">
                        <div className="item-folio__thumb">
                          <Link
                            className=""
                            title={
                              element.childMarkdownRemark.frontmatter
                                .description
                            }
                            to={`/blog/${element.relativeDirectory}`}
                          >
                            <img src={srx.src} srcSet={srx.srcSet} />
                          </Link>
                        </div>
                        <div className="item-folio__text">
                          <h3 className="item-folio__title">
                            {element.childMarkdownRemark.frontmatter.title}
                          </h3>
                          <p className="item-folio__cat">
                            <strong style={{ color: "#862121" }}>
                              {element.childMarkdownRemark.frontmatter.category}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogByCategory = ({ blogItems }) => {
  return (
    <section className="s-works  bootstrap-wrapper">
      <div
        className="m-auto narrow section-intro has-bottom-sep"
        style={{ paddingTop: "5em" }}
      >
        <div className="m-auto text-center">
          <h3>Browse by Category</h3>
        </div>
      </div>
      <div className="container blog-content">
        <div className="row">
          {blogItems.map((blog, index) => {
            const xfilter = blogItems.filter(
              (element) =>
                element.childMarkdownRemark.frontmatter.category ===
                blog.childMarkdownRemark.frontmatter.category
            );
            return (
              <article className="col-lg-6 col-sm-12" key={index}>
                <h2
                  className="h01"
                  id={blog.childMarkdownRemark.frontmatter.category}
                >
                  {blog.childMarkdownRemark.frontmatter.category}
                </h2>
                <ul>
                  {xfilter.map((element, index) => (
                    <li key={(index + 1) * 100 * (index + 1)}>
                      <Link
                        title={
                          element.childMarkdownRemark.frontmatter.description
                        }
                        to={`/blog/${element.relativeDirectory}`}
                      >
                        {element.childMarkdownRemark.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Blog = ({ location, data }) => {
  return (
    <Layout location={location}>
      <SearchEnggOp title={data.site.siteMetadata.blogName} />
      <section
        className="s-home page-hero  parallax bootstrap-wrapper"
        data-natural-height="2000"
        data-natural-width="3000"
        data-parallax="scroll"
        data-position-y="center"
        id="blog-header"
      >
        <div className="overlay" />
        <div className="home-content">
          <div className="container home-content__main">
            <h3 className="ital-hover">Official Blog of Nirmal Khedkar</h3>
            <h1 className="page-header__title">
              <Link title="" to="/blog">
                {data.site.siteMetadata.blogName}
              </Link>
            </h1>
            <div className="page-header__info">
              <div className="page-header__cat">
                Technology, Finance, Environment and the Future.
              </div>
            </div>
            <div className="home-content__buttons">
              <blog className="smoothscroll btn btn--stroke" href="#blog-first">
                Explore
              </blog>
            </div>
          </div>
        </div>
        <SocialMediaIcons />
      </section>
      <LatestBlogItem item={data.allFile.nodes[0]} />
      <MasonPanel
        blogItems={data.allFile.nodes}
        sitename={data.site.siteMetadata.blogName}
      />
      <BlogByCategory blogItems={data.allFile.nodes} />
    </Layout>
  );
};
export const postQuery = graphql`
  {
    allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        ext: { eq: ".md" }
        childMarkdownRemark: { frontmatter: { draft: { in: [null, false] } } }
      }
      sort: { fields: childMarkdownRemark___frontmatter___date, order: DESC }
    ) {
      nodes {
        relativeDirectory
        childMarkdownRemark {
          frontmatter {
            title
            date(formatString: "MMMM DD,YYYY")
            category
            description
            img {
              childImageSharp {
                fixed {
                  srcWebp
                  srcSetWebp
                }
              }
              publicURL
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        blogName
      }
    }
  }
`;

export default Blog;
