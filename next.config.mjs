import bundleAnalyzer from "@next/bundle-analyzer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const getGitCommitSha = () => {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

const gitCommitSha =
  process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  process.env.GITHUB_SHA?.slice(0, 7) ||
  getGitCommitSha();

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/rss": ["./content/blog/*.md"],
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT_SHA: gitCommitSha,
    NEXT_PUBLIC_BLOG_IDS: JSON.stringify(
      fs.readdirSync(path.join(import.meta.dirname, "content/blog"))
        .filter((file) => file.endsWith(".md"))
        .map((file) => file.slice(0, -3))
        .sort()
    ),
  },
  async redirects() {
    return [
      ...(process.env.NODE_ENV !== "development" ? [{ source: "/design", destination: "/", permanent: true }] : []),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noai, noimageai",
          },
        ],
      },
    ];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/rss.xml", destination: "/api/rss" },
      {
        source: "/.well-known/webfinger",
        destination: "/api/.well-known/webfinger",
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/25480443",
      },
    ],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
  },
};

export default withBundleAnalyzer(nextConfig);
