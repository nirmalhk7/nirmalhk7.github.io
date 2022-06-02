import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";

const MasonPanel = ({ blogItems }) => {
  return (
    <section className="bg-gray">
      <div className="">
        <div className="max-w-screen-lg m-auto" style={{ maxWidth: "1500px" }}>
          <div
            className="section_intro has-bottom-sep"
            style={{ paddingTop: "5em" }}
          >
            <div className="text-center">
              <h3>Eclipse</h3>
              <h1>All Posts</h1>
            </div>
          </div>
          <div className="blog-list block-1-2 block-w-full">
            <div className="columns-4">
              {blogItems.map((element, index) => {

                return (
                  <div
                    className="break-inside-avoid-column masonry__brick"
                    key={index}
                  >
                    <div className="overflow-hidden relative hover:opacity-100 hover:visible">
                      <div className="item-folio__thumb">
                        <Link
                          className=""
                          title={element.childMarkdownRemark.frontmatter.description}
                          to={`/blog/${element.relativeDirectory}`}
                        >
                          <GatsbyImage
                            alt={element.childMarkdownRemark.frontmatter.title}
                            layout="fill"
                            image={getImage(element.childMarkdownRemark.frontmatter.img)}
                          />
                        </Link>
                      </div>
                      <div className="pt-0 pb-0 pl-12 pr-12 z-10 bottom-12	left-0 absolute">
                        <h3 className="text-white text-base font-semibold m-0 uppercase font-blocky">
                          {element.childMarkdownRemark.frontmatter.title}
                        </h3>
                        <strong className="text-accent">
                          {element.childMarkdownRemark.frontmatter.category}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default MasonPanel;
