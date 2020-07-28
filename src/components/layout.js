/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
// import { useStaticQuery, graphql } from "gatsby"

import Navbar from "./partials/navbar"
import Footer from "./partials/footer"
import ContactForm from "./partials/contactme"
import RandomQuote from "./partials/quote"


const Layout = ({ children }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)

  return (
    <>
      {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
      <Navbar />
      <div>
        <main>{children}</main>
      </div>
      <RandomQuote/>
      <ContactForm />
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
