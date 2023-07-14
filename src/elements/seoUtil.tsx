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
      <meta name="description" content={metaDescription} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content='website' />
      <meta name="twitter:card" content='summary' />
      <meta name="twitter:creator" content='Nirmal Khedkar' />
      <meta name="twitter:title" content=""/>
      <meta name="twitter:description" content=""/>
      <title>tk</title>
    </Head>
  );
}

export default SEOUtil;
