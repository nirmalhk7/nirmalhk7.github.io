import React from "react";

import Layout from "../layouts/main";
import SearchEnggOp from "../components/seo";
import { graphql, Link } from "gatsby";
import SocialMediaIcons from "../components/social";
import LatestBlogItem from "../components/latestBlog";
import MasonPanel from "../components/allBlogs";
// import SocialMediaSideIcons from "../components/social"





const Blog = ({ location, data }) => {
  if(!data) return null;
  return (
    <Layout location={location}>
      <SearchEnggOp title={data.site.siteMetadata.blogName} />
      <section
        className="s-home page-hero  parallax bootstrap-wrapper"
        data-natural-height="2000"
        data-natural-width="3000"
        data-parallax="scroll"
        data-position-y="center"
        id="blog-header"
      >
        <div className="overlay" />
        <div className="home-content">
          <div className="container home-content__main">
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
              <blog className="smoothscroll btn btn-outline-white" href="#blog-first">
                Explore
              </blog>
            </div>
          </div>
        </div>
        <SocialMediaIcons />
      </section>
      <LatestBlogItem item={data.allFile.nodes[0]} />
      <MasonPanel
        blogItems={data.allFile.nodes}
        sitename={data.site.siteMetadata.blogName}
      />
    </Layout>
  );
};
export const potQuery = graphql`
  query xyz {
    abc: allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        ext: { eq: ".md" }
     }
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
                fixed {
                  srcWebp
                  srcSetWebp
                }
              }
              publicURL
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
