module.exports = {
  siteMetadata: {
    title: `Official Website of Nirmal Khedkar`,
    description: `Product Developer, ML Enthusiast, learner and motorsport enthusiast: Hi, I'm Nirmal Khedkar.`,
    author: `Nirmal Khedkar`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages-markdown`,
        path: `${__dirname}/blog/`,
      },
    }
  ],
}
