import React from "react";

import Layout from "../layouts/mainLayout";
import SearchEnggOp from "../elements/seo";
import { graphql, Link, PageProps } from "gatsby";
import LatestBlogItem from "../elements/latestBlogSection";
import MasonPanel from "../elements/blogListSection";
import Jumbotron from "../elements/jumbotron";
import Utils  from "../elements/utils";

type BlogPageTypes= {
  site: {
    siteMetadata: {
      blogName: string
    }
  }
  blogs: {
    nodes: {
      relativeDirectory: string,
      childMarkdownRemark: {
        frontmatter: any
      }
    }[]
  }
}

const Blog = ({ location, data }: PageProps<BlogPageTypes>) => {
  if (!data) return null;
  return (
    <Layout location={location}>
      <SearchEnggOp title={data.site.siteMetadata.blogName} />
      <Jumbotron.Max
        HeadingTextComponent={
          <h1 className="page-header__title">
            <Link title="" to="/blog">
              {data.site.siteMetadata.blogName}
            </Link>
          </h1>
        }
        bgImg="bg-blogWallpaper"
        buttonDetails={[["Explore", "#blog-first"]]}
        orangeText="Official Blog of Nirmal Khedkar"
      />
      <LatestBlogItem
        frontmatter={Utils.getFrontmatter(data.blogs.nodes[0])}
        relativeDirectory={data.blogs.nodes[0].relativeDirectory}
      />
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
      sort: { fields: childrenMarkdownRemark___frontmatter___date, order: DESC }
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
