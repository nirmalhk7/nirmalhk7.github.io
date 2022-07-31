import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
import { getItem } from "./util";

const MasonPanel = ({ blogItems }) => {
  return (
    <section className="bg-gray">
      <div>
        <div className=" m-auto" style={{ maxWidth: "1500px" }}>
          <div
            className="section_intro has-bottom-sep"
            style={{ paddingTop: "5em" }}
          >
            <div className="text-center">
              <h3>{blogName}</h3>
              <h1>All Posts</h1>
            </div>
          </div>
          <div>
            <div className="columns-4">
              {blogItems.map((element, index) => {
                return (
                  <div className="break-inside-avoid-column" key={index}>
                    <div className=" overflow-hidden relative hover:opacity-100 hover:visible">
                      <div className=" before:bg-black before:z-10">
                        <Link
                         
                          title={
                            getItem(element).description
                          }
                          to={`/blog/${element.relativeDirectory}`}
                        >
                          <GatsbyImage
                            alt={getItem(element).title}
                            layout="fill"
                            image={getImage(
                              getItem(element).img
                            )}
                          />
                        </Link>
                      </div>
                      <div className="pt-0 pb-0 pl-12 pr-12 z-10 bottom-12	left-0 absolute">
                        <h3 className="text-white text-base font-semibold m-0 uppercase font-blocky">
                          {getItem(element).title}
                        </h3>
                        <strong className="text-accent">
                          {getItem(element).category}
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
