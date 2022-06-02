import React from "react";

import Layout from "../layouts/main";
import SearchEnggOp from "../elements/seo";
import { graphql, Link } from "gatsby";
import SocialMediaIcons from "../elements/social/social";
import LatestBlogItem from "../elements/latestBlog";
import MasonPanel from "../elements/blogList";

const Blog = ({ location, data }) => {
  if(!data) return null;
  return (
    <Layout location={location}>
      <SearchEnggOp title={data.site.siteMetadata.blogName} />
      <section
        className="s-home page-hero  bg-fixed bg-center bg-no-repeat "
        data-natural-height="2000"
        data-natural-width="3000"
        data-parallax="scroll"
        data-position-y="center"
        id="blog-header"
      >
        <div className="overlay" />
        <div className="home-content">
          <div className="container mx-auto home-content__main">
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
            <div className="absolute right-0 text-center bottom-8">
              <a
                className="btn btn-outline-white"
                href="#blog-first"
              >
                Explore
              </a>
            </div>
          </div>
        </div>
        <SocialMediaIcons />
      </section>
      <LatestBlogItem relativeDirectory={data.blogs.nodes[0].relativeDirectory} frontmatter={data.blogs.nodes[0].childMarkdownRemark.frontmatter} />
      <MasonPanel
        blogItems={data.blogs.nodes}
        sitename={data.site.siteMetadata.blogName}
      />
    </Layout>
  );
};
export const potQuery = graphql`
  query xyz {
    blogs: allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        ext: { eq: ".md" }
     }
     sort: {fields: childrenMarkdownRemark___frontmatter___date, order: DESC}
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
                gatsbyImageData(width:400, placeholder: BLURRED)
              }
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
