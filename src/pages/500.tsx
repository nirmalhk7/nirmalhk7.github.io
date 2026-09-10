import Link from "next/link";
import { GetStaticProps } from "next";
import React from "react";

import { DefaultPageProps } from "./_app";

const ServerErrorPage = () => (
  <main className="min-h-screen bg-[#0d0a0b] px-6 py-32 text-center text-white">
    <h1 className="mb-6 text-7xl text-accent">Something went wrong</h1>
    <p className="mx-auto mb-10 max-w-2xl text-2xl text-gray-300">
      The server could not complete this request. Try again, or return to the
      homepage to keep exploring.
    </p>
    <Link href="/" className="button button-accent-fill inline-block">
      Return home
    </Link>
  </main>
);

export const getStaticProps: GetStaticProps<DefaultPageProps> = async () => ({
  props: {
    pageMetadata: {
      enableWrap: true,
      seoMetadata: {
        title: "Server Error",
        description: "The server could not complete this request.",
        noindex: true,
        nofollow: true,
      },
    },
  },
});

export default ServerErrorPage;
