/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it


// query {
//     markdownRemark(id: {glob: "81982f8e-6f99-53b1-9ce1-bf74b6f61bce"}) {
//       html
//       frontmatter {
//         title
//         tags
//       }
//     }
//   }

const path = require('path');

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;
    return new Promise((resolve, reject) => {
        const blogPostTemplate = path.resolve('src/blog-article.js');
        // Query for markdown nodes to use in creating pages.
        resolve(
            graphql(
                `
					query {
                        allFile(filter: {sourceInstanceName: {eq: "pages-markdown"}}) {
                            edges {
                                node {
                                    name
                                    childMarkdownRemark {
                                        id
                                    }
                                }
                            }
                        }
					}
                `

            ).then(result => {
                // console.log(results.data);
                const posts = result.data.allFile.edges;
                posts.forEach(({ node }) => {
                    console.log(node.name)
                    const postName = node.name.split('-').slice(3, node.name.length).join("-");
                    let postDate = node.name.split('-').slice(0,3).join("-");
                    postDate= new Date(Date.parse(postDate))
                    const path = "blog/" + postName;
                    if(postDate<=new Date())
                    {
                        console.log("Adding Page", node.childMarkdownRemark.id)
                        createPage({
                            path,
                            component: blogPostTemplate,
                            context: {
                                pathSlug: node.childMarkdownRemark.id
                            }
                        });
                        resolve();
                    }
                });
            })
        );
    });
};
