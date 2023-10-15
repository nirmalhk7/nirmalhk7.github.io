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
  const finalTitle= `${title} | Nirmal Khedkar`
  return (
    <Head>
      <meta name="description" content={metaDescription} />
      <meta name="og:title" content={finalTitle} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content='website' />
      <meta name="twitter:card" content='summary' />
      <meta name="twitter:creator" content='Nirmal Khedkar' />
      <meta name="twitter:title" content={finalTitle}/>
      <meta name="twitter:description" content=""/>
      <link rel="me" href="https://fosstodon.org/@nirmalhk7"/>
      <title>{finalTitle}</title>
    </Head>
  );
}

export default SEOUtil;
