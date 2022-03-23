const path = require("path");
const fs = require("fs");
const getEnvVariables = (env) => {
  let inp = fs.readFileSync(`.env.${env}`, { encoding: "utf-8" });
  let arr = inp.split("\n");
  arr.forEach((element) => {
    let ans = element.split("=")[1];
    if (ans === "true") {
      ans = true;
    } else if (ans === "false") {
      ans = false;
    }
    process.env[element.split("=")[0]] = ans;
  });
};

const downloadImage = (url, location) => {
  var https = require("https"),
    Stream = require("stream").Transform,
    fs = require("fs");

  https
    .request(url, function (response) {
      var data = new Stream();

      response.on("data", function (chunk) {
        data.push(chunk);
      });

      response.on("end", function () {
        fs.writeFileSync(location, data.read());
      });
    })
    .end();
  console.log("Downloaded image", url);
};

exports.onPreBuild = ({graphql}) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query MyQuery {
            siteDetails: site {
              siteMetadata {
                url
                author
              }
            }
          }
        `
      ).then((result) => {
        console.log(result);
      })
    );
  });
};
exports.createPages = ({ page, graphql, actions }, { paths }) => {
  const { createPage, deletePage } = actions;
  getEnvVariables(process.env.NODE_ENV);
  downloadImage(
    "https://avatars.githubusercontent.com/u/25480443",
    "src/assets/images/profile.png"
  );
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve("src/templates/blog-article.js");

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
    );
  });
};
