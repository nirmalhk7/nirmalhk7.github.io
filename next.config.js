/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      }
    )
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  async rewrites() {
    return [
        {
          source: '/.well-known/webfinger',
          destination: '/api/.well-known/webfinger'
        }
    ];
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/25480443',
      },
    ],
  },
}

module.exports = nextConfig
