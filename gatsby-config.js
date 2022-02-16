const fs = require("fs");
const path = require("path");
// Get paths of Gatsby's required rules, which as of writing is located at:
// https://github.com/gatsbyjs/gatsby/tree/fbfe3f63dec23d279a27b54b4057dd611dce74bb/packages/
// gatsby/src/utils/eslint-rules
const gatsbyRequiredRules = path.join(
 process.cwd(),
 "node_modules",
 "gatsby",
 "dist",
 "utils",
 "eslint-rules"
);
module.exports = {
  siteMetadata: {
    title: `Nirmal Khedkar`,
    description: `Product Developer, ML Enthusiast, learner and motorsport enthusiast: Hi, I'm Nirmal Khedkar.`,
    author: `Nirmal Khedkar`,
    url: `nirmalhk7.tech`,
    blogName: `Pitlane Chat`,
    email: "nirmalhk7@gmail.com",
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },

    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `yml`,
        path: `${__dirname}/content/yml/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-landing`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/images/eagle.svg`,
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-64L3FHCW3R", // Google Analytics / GA
        ],
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `tomato`,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },

    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                url
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allFile } }) => {
              return allFile.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  url: site.siteMetadata.url + "/blog/" + node.relativeDirectory,
                  html: node.html,
                });
              });
            },
            query: `
            {
              allFile(filter: {sourceInstanceName: {eq: "blog"}, extension: {eq: "md"}, childMarkdownRemark: {frontmatter: {draft: {ne: true}}}}) {
                nodes {
                  relativeDirectory
                  childMarkdownRemark {
                    html
                    frontmatter {
                      title
                      description
                      date(formatString: "MMMM DD,YYYY")
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
              }
            }
            `,
            output: "/rss.xml",
            title: "nirmalhk7.tech RSS Feed",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        // Gatsby required rules directory
        rulePaths: [gatsbyRequiredRules],
        // Default settings that may be ommitted or customized
        stages: ["develop"],
        extensions: ["js", "jsx", "ts", "tsx"],
        exclude: ["node_modules", "bower_components", ".cache", "public"],
        // Any additional eslint-webpack-plugin options below
        // ...
      },
    },
    {
			resolve: 'gatsby-plugin-pdf',
			options: {
				paths: ['/blog'],
        allPages: false,
				outputPath: '/static',
			},
		},
    { 
      resolve: `gatsby-plugin-purgecss`,
      options: {
        develop: true, // Enable while using `gatsby develop`
        // tailwind: true, // Enable tailwindcss support
        // whitelist: ['whitelist'], // Don't remove this selector
        // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      }
    }
  ],
};
