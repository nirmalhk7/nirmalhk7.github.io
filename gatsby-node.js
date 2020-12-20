const path = require("path");

exports.createPages = ({ page, graphql, actions }, { paths }) => {
  const { createPage, deletePage } = actions;
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve("src/blog-article.js");
    // Query for markdown nodes to use in creating pages.
    if (process.env.DRAFT.toLowerCase() === "true") {
      console.log("Draft mode ENABLED");
    }
    resolve(
      graphql(
        `
          query MyQuery {
            blog: allFile(
              filter: {
                sourceInstanceName: { eq: "blog" }
                ext: { eq: ".md" }
                ${
                  process.env.DRAFT.toLowerCase() === "true" ? "": "childMarkdownRemark: { frontmatter: { draft: { ne: true } } }"
                }
              }
            ) {
              edges {
                node {
                  relativeDirectory
                  childMarkdownRemark {
                    html
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
          console.log(
            "Blog",
            "Endpoint for",
            post.node.childMarkdownRemark.frontmatter.title
          );
          createPage({
            path: "blog/" + post.node.relativeDirectory,
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
      // .then(()=>{
      //   const Resume= path.resolve("Resume.pdf")
      //   console.log("Resume","Endpoint for Resume")
      //   createPage({
      //     path:"resume",
      //     component: Resume
      //   })
      // })
    );
  });
};
