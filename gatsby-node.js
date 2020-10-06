const path = require("path");
const moment = require("moment");

exports.createPages = ({ page, graphql, actions }, { paths }) => {
  const { createPage, deletePage } = actions;
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve("src/blog-article.js");
    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allFile(filter: { sourceInstanceName: { eq: "pages-markdown" }, ext: { eq: ".md" } }) {
              edges {
                node {
                  name
                  childMarkdownRemark {
                    id
                  }
                  relativeDirectory
                }
              }
            }
          }
        `
      ).then((result) => {
        // TODO Add route for PDF
        const posts = result.data.allFile.edges;
        posts.forEach(({ node }) => {
          const postName = node.relativeDirectory.split("-").slice(3, node.relativeDirectory.length).join("-");
          let postDate = node.relativeDirectory.split("-").slice(0, 3).join("-");
          postDate = new Date(Date.parse(postDate));
          const path = "blog/" + postName;
          if (postDate <= new Date() || process.env.NODE_ENV==="development") {
            console.log("Generating route for", postName);
            createPage({
              path,
              component: blogPostTemplate,
              context: {
                pathSlug: node.childMarkdownRemark.id,
              },
            });
            resolve();
          }
        });
      })
    );
  });
};
