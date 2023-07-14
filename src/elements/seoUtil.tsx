/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";

import { useStaticQuery, graphql } from "gatsby";
import Head from "next/head";

interface SEOInterface {
  description?: string,
  lang?: string,
  meta?: [],
  title: string
}

function SEOUtil({ description, lang='en', meta=[], title }: SEOInterface) {
  const site = {}
  const metaDescription = description || "";

  return (
    <Head>
      <meta name="description"/>
      </Head>
    // <Helmet
    //   htmlAttributes={{lang}}
    //   meta={[
    //     {
    //       name: `description`,
    //       content: metaDescription,
    //     },
    //     {
    //       property: `og:title`,
    //       content: title,
    //     },
    //     {
    //       property: `og:description`,
    //       content: metaDescription,
    //     },
    //     {
    //       property: `og:type`,
    //       content: `website`,
    //     },
    //     {
    //       name: `twitter:card`,
    //       content: `summary`,
    //     },
    //     {
    //       name: `twitter:creator`,
    //       content: site.siteMetadata.author,
    //     },
    //     {
    //       name: `twitter:title`,
    //       content: title,
    //     },
    //     {
    //       name: `twitter:description`,
    //       content: metaDescription,
    //     },
    //   ].concat(meta)}
    //   title={title}
    //   titleTemplate={`%s | ${site.siteMetadata.title}`}
    // />
  );
}

export default SEOUtil;
