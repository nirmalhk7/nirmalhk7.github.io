import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
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
                              <GatsbyImage alt={element.relativeDirectory} image={getImage(element.childMarkdownRemark.frontmatter.img)}/>
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

  export default MasonPanel;