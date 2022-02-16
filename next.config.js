module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack(config, options) {
    return config;
  }
};

const withYAML = require('next-yaml');
module.exports = withYAML(module.exports);