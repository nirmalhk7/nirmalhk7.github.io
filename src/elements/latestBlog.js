import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";

const LatestBlogItem = ({ relativeDirectory, frontmatter }) => {
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
      <div className="sm:container max-w-screen-lg">
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          <div className>
            <GatsbyImage
              alt="Latest Blog"
              image={getImage(frontmatter.img)}
              style={{ width: "70%", height: "auto" }}
            />
          </div>
          <div className="text-md-right">
            <h1
              className="entry-title text-white no-underline"
              style={{ textDecoration: "none" }}
            >
              {frontmatter.title}
            </h1>
            <div
              className="entry-content text-white no-underline"
              style={{ textDecoration: "none" }}
            >
              <p>{frontmatter.description}</p>
            </div>
            <Link
              className="btn btn-outline-white btn-outline-fill-white "
              to={`/blog/${relativeDirectory}`}
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

export default LatestBlogItem;
