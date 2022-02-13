import Head from 'next/head';
import config from '../config';

export default function SEO({ description, title }) {
  const siteTitle = config.title;

  return (
    <Head>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta content={description} name="description" />
      <meta content="website" property="og:type" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={siteTitle} property="og:site_name" />
      <meta content="summary" property="twitter:card" />
      <meta content={config.social.twitter} property="twitter:creator" />
      <meta content={title} property="twitter:title" />
      <meta content={description} property="twitter:description" />
    </Head>
  );
}