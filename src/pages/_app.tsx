import React from "react";

import "@/assets/css/tailwind.scss";
// import "font-awesome/css/font-awesome.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";

import type { AppProps } from 'next/app'
import { DefaultSeo } from "next-seo";
import { GoogleAnalytics } from '@next/third-parties/google'

config.autoAddCss = false;
export default function App({ Component, pageProps }: AppProps) {
  return <>
    <DefaultSeo
      defaultTitle="Nirmal Khedkar | Official Website"
      
      description="SWE and Cloud enthusiast. Hi, I'm Nirmal Khedkar."
      openGraph={{
        type:'website',
        locale: 'en_IN',
        url: 'https://nirmalhk7.com',
        siteName: 'Official Website of Nirmal Khedkar'
      }}
      additionalLinkTags={[{rel:"me",href:"https://fosstodon.org/@nirmalhk7"}]}
      twitter={{cardType:'summary',handle:'nirmalhk7', site:"https://nirmalhk7.com"}}
      titleTemplate="%s | Nirmal Khedkar"
    />
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLETAG || ""}/>
    <Component {...pageProps} /></>
}