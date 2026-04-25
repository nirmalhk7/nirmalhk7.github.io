/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    if (process.env.NEXT_PUBLIC_LEANMODE && false) {
      return [
        {
          source: "/projects",
          destination: "/",
          permanent: false,
        },
        {
          source: "/blog",
          destination: "/",
          permanent: false,
        },
        {
          source: "/blog/:id",
          destination: "/",
          permanent: false,
        },
      ];
    }
    if (process.env.NODE_ENV!=="development") {
      return [
        {
          source: "/design",
          destination: "/",
          permanent: true,
        },
      ];
    }
    return [];
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  webpack: function (config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: "js-yaml-loader",
    });
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/webfinger",
        destination: "/api/.well-known/webfinger",
      },
    ];
  },
  images: {
    domains: ["localhost"],
    remotePatterns: [
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

module.exports = nextConfig;
