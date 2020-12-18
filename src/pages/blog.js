import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Img from "gatsby-image";
import { useStaticQuery, graphql, Link } from "gatsby";
// import SocialMediaSideIcons from "../components/partials/social"

const LatestBlogItem = ({ item }) => {
  let latestBlogFile = item.relativeDirectory;
  let latestBlogAddress = latestBlogFile.split("-").slice(3, latestBlogFile.length).join("-");
  return (
    <>
      <section className="s-works inv target-section" id="blog">
        <div className="row blog-content">
          <div className="col-full">
            <div className="blog-list block-1-2 block-tab-full" style={{ marginTop: "0rem" }}>
              <div className="row">
                <div className="col-block">
                  <Img
                    fluid={item.childMarkdownRemark.frontmatter.img.childImageSharp.fluid}
                    style={{ maxHeight: "350px" }}
                  />
                </div>
                <div className="col-block">
                  <h3 className="inv-header" style={{ color: "antiquewhite" }}></h3>
                  <h1 className="entry-title">
                    <Link className="white-text title-inv" to={"/blog/" + latestBlogAddress}>
                      {item.childMarkdownRemark.frontmatter.title}
                      &nbsp;&nbsp;
                      {item.draft === true ? <code style={{ color: "black" }}>Draft</code> : <></>}
                    </Link>
                  </h1>
                  <div className="entry-content white-text">
                    <p>{item.childMarkdownRemark.frontmatter.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const MasonPanel = ({ blogItems }) => {
  return (
    <section className="blog-content-wrap">
      <div className="row blog-content">
        <div className="col-full">
          <div className="row narrow section-intro has-bottom-sep" style={{ paddingTop: "5em" }}>
            <div className="col-full text-center">
              <h3>Spaceride</h3>
              <h1>All Posts</h1>
              <p className="lead"></p>
            </div>
          </div>
          <div className="blog-list block-1-2 block-tab-full">
            <div className="row masonry-wrap">
              <div className="masonry">
                {blogItems.map((element, index) => {
                  let filename = element.node.relativeDirectory;
                  let address = filename.split("-").slice(3, filename.length).join("-");
                  return (
                    <div key={index} className="masonry__brick">
                      <div className="item-folio">
                        <div className="item-folio__thumb">
                          <Link
                            to={"/blog/" + address}
                            className=""
                            title={element.node.childMarkdownRemark.frontmatter.description}
                          >
                            <Img fluid={element.node.childMarkdownRemark.frontmatter.img.childImageSharp.fluid} />
                          </Link>
                        </div>
                        <div className="item-folio__text">
                          <h3 className="item-folio__title">
                            {element.node.childMarkdownRemark.frontmatter.title}
                          </h3>
                          <p className="item-folio__cat">
                            <strong style={{ color: "#862121" }}>
                              {element.node.childMarkdownRemark.frontmatter.category}
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
  let hashFilters = {};
  return (
    <section className="s-works target-section">
      <div className="row narrow section-intro has-bottom-sep" style={{ paddingTop: "5em" }}>
        <div className="col-full text-center">
          <h3>Browse by Category</h3>
        </div>
      </div>
      <div className="row blog-content">
        <div className="col-full">
          <div className="blog-list block-1-2 block-tab-full">
            {blogItems.map((a, i) => {
              let category = a.node.childMarkdownRemark.frontmatter.category;
              let xfilter = blogItems.filter((e) => e.node.childMarkdownRemark.frontmatter.category === category);
              return (
                <article key={i} className="col-block">
                  <h2 id={category} className="h01">
                    {category}
                  </h2>
                  <ul>
                    {xfilter &&
                      xfilter.map((element, index) => {
                        let title = element.node.childMarkdownRemark.frontmatter.title;
                        let filename = element.node.relativeDirectory;
                        let address = filename.split("-").slice(3, filename.length).join("-");
                        return (
                          <li key={(index + 1) * 100 * (i + 1)}>
                            <Link title={title} to={"/blog/" + address}>
                              {title}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Blog = (props) => {
  let blogItems = props.data && props.data.allFile.edges;
  const getDatefromFilename = (name) => {
    let d = new Date(name.split("-").slice(0, 3).join("-"));
    return d;
  };
  blogItems = blogItems.sort((a, b) => {
    return getDatefromFilename(b.node.relativeDirectory) - getDatefromFilename(a.node.relativeDirectory);
  });
  blogItems = blogItems.filter((x) => {
    let fileDate = new Date(Date.parse(x.node.relativeDirectory.split("-").slice(0, 3).join("-")));
    if (fileDate <= new Date() && fileDate!=='Invalid Date') {
      return true;
    }
  });

  return (
    <Layout>
      <SEO title="Spaceride" />
      <section
        className="blog-wallpaper s-home page-hero target-section parallax"
        data-parallax="scroll"
        data-natural-width="3000"
        data-natural-height="2000"
        data-position-y="center"
      >
        <div className="overlay"></div>
        <div className="home-content">
          <div className="row home-content__main">
            <h3>Official Blog of Nirmal Khedkar</h3>
            <h1 className="page-header__title">
              <a href="/blog" title="">
                Spaceride
              </a>
            </h1>
            <div className="page-header__info">
              <div className="page-header__cat">
                <div className="typewriter">Technology, Finance, Environment and Future.</div>
              </div>
            </div>
            <div className="home-content__buttons">
              <a href="#blog" className="smoothscroll btn btn--stroke">
                Liftoff!
              </a>
            </div>
          </div>
        </div>
      </section>
      <LatestBlogItem item={blogItems[0].node} />
      <MasonPanel blogItems={blogItems} />
      <BlogByCategory blogItems={blogItems} />
    </Layout>
  );
};
export const postQuery = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "pages-markdown" }, ext: { eq: ".md" } }) {
      edges {
        node {
          relativeDirectory
          childMarkdownRemark {
            id
            frontmatter {
              title
              tags
              description
              category
              img {
                childImageSharp {
                  fluid {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export default Blog;
