import React from "react";

import Layout from "../components/layout";
import SearchEnggOp from "../components/seo";
import SocialMediaIcons from "../components/partials/social";
// import SocialMediaSideIcons from "../components/partials/social"
import Link from "../components/partials/link";

const LatestBlogItem = ({ item }) => {
  let srx = item.frontmatter.img;
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
      className="bg-gradient-accent"
      id="blog-first"
      style={{
        textDecoration: "none",
        paddingTop: "2em",
        paddingBottom: "2em",
      }}
    >
      <div className="sm:container blog-content">
        {/* <Link
          className="blog-list block-1-2 block-w-full"
          style={{ marginTop: "0rem" }}
          to={`/blog/${item.relativeDirectory}`}
        > */}
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <img
              alt="Latest Blog"
              src={srx.src}
              srcSet={srx.srcSet}
              style={{ width: "70%", height: "auto" }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12  text-md-right">
            <h1
              className="entry-title text-white text-decoration-none"
              style={{ textDecoration: "none" }}
            >
              {item.frontmatter.title}
            </h1>
            <div
              className="entry-content text-white text-decoration-none"
              style={{ textDecoration: "none" }}
            >
              <p>{item.frontmatter.description}</p>
            </div>
            <Link
              className="btn btn-outline-white btn-outline-fill-white "
              to={`/blog/${item.relativeDirectory}`}
            >
              Read More
            </Link>
          </div>
        </div>
        {/* </Link> */}
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
            className="section_intro has-bottom-sep"
            style={{ paddingTop: "5em" }}
          >
            <div className="text-center">
              <h3>{sitename}</h3>
              <h1>All Posts</h1>
            </div>
          </div>
          <div className="blog-list block-1-2 block-w-full">
            <div className="row">
              <div className="masonry">
                {blogItems.map((element, index) => {
                  let srx = element.frontmatter.img;
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
                            title={element.frontmatter.description}
                            to={`/blog/${element.relativeDirectory}`}
                          >
                            <img
                              alt={element.frontmatter.title}
                              src={srx.src}
                              srcSet={srx.srcSet}
                            />
                          </Link>
                        </div>
                        <div className="item-folio__text">
                          <h3 className="item-folio__title">
                            {element.frontmatter.title}
                          </h3>
                          <p className="item-folio__cat">
                            <strong style={{ color: "#862121" }}>
                              {element.frontmatter.category}
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
    <section className="bg-gray ">
      <div
        className="m-auto narrow section_intro has-bottom-sep"
        style={{ paddingTop: "5em" }}
      >
        <div className="m-auto text-center">
          <h3>Browse by Category</h3>
        </div>
      </div>
      <div className="sm:container mx-auto blog-content">
        <div className="row">
          {blogItems.map((blog, index) => {
            const xfilter = blogItems.filter(
              (element) =>
                element.frontmatter.category === blog.frontmatter.category
            );
            return (
              <article className="col-lg-6 col-sm-12" key={index}>
                <h2 className="h01" id={blog.frontmatter.category}>
                  {blog.frontmatter.category}
                </h2>
                <ul>
                  {xfilter.map((element, index) => (
                    <li key={(index + 1) * 100 * (index + 1)}>
                      <Link
                        title={element.frontmatter.description}
                        to={`/blog/${element.relativeDirectory}`}
                      >
                        {element.frontmatter.title}
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
        className="s-home page-hero  parallax"
        data-natural-height="2000"
        data-natural-width="3000"
        data-parallax="scroll"
        data-position-y="center"
        id="blog-header"
      >
        <div className="overlay" />
        <div className="home-content">
          <div className="sm:container mx-auto home-content__main">
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
              <blog
                className="smoothscroll btn btn-outline-white"
                href="#blog-first"
              >
                Explore
              </blog>
            </div>
          </div>
        </div>
        <SocialMediaIcons />
      </section>
      <LatestBlogItem item={data.allFile[0]} />
      <MasonPanel
        blogItems={data.allFile}
        sitename={data.site.siteMetadata.blogName}
      />
      <BlogByCategory blogItems={data.allFile} />
    </Layout>
  );
};

export default Blog;
