import React from "react";

import Layout from "../layouts/main";
import SearchEnggOp from "../components/seo";
import { graphql, Link } from "gatsby";
import SocialMediaIcons from "../components/social";
import LatestBlogItem from "../components/latestBlog";
import MasonPanel from "../components/allBlogs";
import { MegaJumbotron } from "../components/jumbotron";
// import SocialMediaSideIcons from "../components/social"

const Blog = ({ location, data }) => {
  if (!data) return null;
  return (
    <Layout location={location}>
      <SearchEnggOp title={data.site.siteMetadata.blogName} />
      <MegaJumbotron
        buttonsSection={
          <Link className="smoothscroll btn btn-outline-white" to="#blog-first">
            Explore
          </Link>
        }
        header={data.site.siteMetadata.blogName}
        id="blog-header"
        infoSection={
          <div className="page-header__cat">
            Technology, Finance, Environment and the Future.
          </div>
        }
        miniHeader="Official Blog of Nirmal Khedkar"
      />
      <LatestBlogItem item={data.blogs.nodes[0]} />
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
      filter: { sourceInstanceName: { eq: "blog" }, ext: { eq: ".md" } }
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
                gatsbyImageData(width: 400, placeholder: BLURRED)
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
