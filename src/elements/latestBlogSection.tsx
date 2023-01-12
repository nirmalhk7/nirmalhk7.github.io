import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";

const LatestBlogSection = ({ relativeDirectory, frontmatter }) => {
  return (
    <section
      className="bg-gradient-to-r from-accent to-accentLight"
      id="blog-first"
      style={{
        textDecoration: "none",
        paddingTop: "2em",
        paddingBottom: "2em",
      }}
    >
      <div className="container mx-auto">
        <div className="grid laptop:grid-cols-2 tablet:grid-cols-2 mobile-l:grid-cols-1 py-10">
          <div>
            <GatsbyImage
              alt="Latest Blog"
              image={getImage(frontmatter.img)}
              style={{ width: "70%", height: "auto" }}
            />
          </div>
          <div className="laptop:text-right tablet:text-right relative">
            <div>
              <h1
                className="font-bold leading-snug mt-0 font-heading text-white"
                style={{ textDecoration: "none" }}
              >
                {frontmatter.title}
              </h1>
              <div
                className="entry-content text-white no-underline mb-10"
                style={{ textDecoration: "none" }}
              >
                <p>{frontmatter.description}</p>
              </div>
              <Link
                className="font-blocky uppercase font-bold mr-4 border-4 no-underline p-5 text-white border-white hover:bg-white hover:text-black"
                to={`/blog/${relativeDirectory}`}
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </section>
  );
};

export default LatestBlogSection;
