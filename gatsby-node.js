const path = require("path");
const fs= require('fs')
const getEnvVariables = (env)=>{
  console.log(env,"mode");
  let inp=fs.readFileSync(`.env.${env}`,{encoding:'utf-8'})
  let arr=inp.split("\n");
  arr.forEach(element => {
      let ans=element.split("=")[1]
      if(ans==='true'){
        ans=true
      } else if(ans==='false'){
        ans=false
      }
      process.env[element.split("=")[0]]=ans
  });
}
exports.createPages = ({ page, graphql, actions }, { paths }) => {
  const { createPage, deletePage } = actions;
  getEnvVariables(process.env.NODE_ENV);
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve("src/blog-article.js");
    if(process.env.DRAFT===false){
      console.log("Draft mode DISABLED")
    } else if (process.env.DRAFT.toLowerCase() === true) {
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
                childMarkdownRemark: { frontmatter: { draft: { in: [null,false,${process.env.DRAFT}] } } }
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
