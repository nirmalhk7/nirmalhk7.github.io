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
						allMarkdownRemark  {
							edges {
								node {
                                    parent {
                                        ... on File {
                                            name
                                        }
                                    }
                                    id
								}
							}
						}
					}
                `

            ).then(result => {
                const posts = result.data.allMarkdownRemark.edges;

                posts.forEach(({ node }) => {
                    console.log(node.parent.name)
                    const postName = node.parent.name.split('-').slice(3, node.parent.name.length).join("-");
                    const path = "blog/" + postName;
                    console.log("Adding page", node.id)

                    createPage({
                        path,
                        component: blogPostTemplate,
                        context: {
                            pathSlug: node.id
                        }
                    });
                    resolve();
                });
            })
        );
    });
};
