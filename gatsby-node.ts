import { GatsbyNode } from "gatsby";

const path = require("path");
const fs = require("fs");
const getEnvVariables = () => {
  const inp = fs.readFileSync(".env", { encoding: "utf-8" });
  inp.split("\n").map((element:string)=>{
    process.env[element.split("=")[0]]=element.split("=")[1];
  });
};


export const createPages: GatsbyNode['createPages'] = ({ page, graphql, actions }, { paths }) => {
  const { createPage, deletePage } = actions;
  getEnvVariables();
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve("src/templates/blogTemplate.tsx");
    resolve(
      graphql(
        `
          query MyQuery {
            blog: allFile(
              filter: {
                sourceInstanceName: { eq: "blog" }
                ext: { eq: ".md" }
                childMarkdownRemark: { frontmatter: { draft: { in: [null,false,${process.env.DRAFT}] } } }
              }
            ) {
              edges {
                node {
                  relativeDirectory
                  childMarkdownRemark {
                    rawMarkdownBody: html
                    frontmatter {
                      title
                      tags
                      draft
                      description
                      date(formatString: "MMMM DD, YYYY")
                      category
                      img {
                        childImageSharp {
                          original {
                            src
                          }
                        }
                      }
                    }
                  }
                }
                next {
                  childMarkdownRemark {
                    frontmatter {
                      title
                      draft
                      description
                      category
                      date(formatString: "MMMM ")
                    }
                  }
                  relativeDirectory
                }
                previous {
                  relativeDirectory
                  childMarkdownRemark {
                    frontmatter {
                      date(formatString: "MMMM DD, YYYY")
                      description
                      category
                      title
                    }
                  }
                }
              }
            }
            siteDetails: site {
              siteMetadata {
                url
                author
              }
            }
          }
        `
      ).then((result) => {
        result.data.blog.edges.map((post) => {
          createPage({
            path: `blog/${  post.node.relativeDirectory}`,
            component: blogPostTemplate,
            context: {
              previous: post.previous,
              next: post.next,
              current: post.node,
              siteDetails: result.data.siteDetails.siteMetadata,
            },
          });
        });
      })
    );
  });
};