import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
const LatestBlogItem = ({ item }) => {
    return (
      <section
        className="bg-gradient-accent bootstrap-wrapper"
        id="blog-first"
        style={{
          textDecoration:"none",
          paddingTop:"2em",
          paddingBottom:"2em"
        }}
      >
        <div className="container blog-content">
          {/* <Link
            className="blog-list block-1-2 block-tab-full"
            style={{ marginTop: "0rem" }}
            to={`/blog/${item.relativeDirectory}`}
          > */}
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
              <GatsbyImage alt={item.relativeDirectory} image={getImage(item.childMarkdownRemark.frontmatter.img)}/>
                              
                
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12  text-md-right">
                <h1 className="entry-title text-white text-decoration-none"  style={{textDecoration:"none"}}>
                  {item.childMarkdownRemark.frontmatter.title}
                </h1>
                <div className="entry-content text-white text-decoration-none"  style={{textDecoration:"none"}}>
                  <p>{item.childMarkdownRemark.frontmatter.description}</p>
                </div>
                <Link className="btn btn-outline-white btn-outline-fill-white " to={`/blog/${item.relativeDirectory}`}>Read More</Link>
              </div>
            </div>
          {/* </Link> */}
        </div>
      </section>
    );
  };

  export default LatestBlogItem;