import React from "react";

import Layout from "../layouts/main";
import SearchEnggOp from "../elements/seo";
import { graphql, Link } from "gatsby";
import LatestBlogItem from "../elements/latestBlog";
import MasonPanel from "../elements/blogList";
import Jumbotron from "../elements/jumbotron";

const Blog = ({ location, data }) => {
  if (!data) return null;
  return (
    <Layout location={location}>
      <SearchEnggOp title={data.site.siteMetadata.blogName} />
      <Jumbotron.fullHeight buttonDetails={[["Explore", "#blog-first"]]} bgImg="bg-blogWallpaper" HeadingTextComponent={<h1 className="page-header__title">
        <Link title="" to="/blog">
          {data.site.siteMetadata.blogName}
        </Link>
      </h1>}
        orangeText="Official Blog of Nirmal Khedkar" />
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
