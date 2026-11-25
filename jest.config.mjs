import nextJest from 'next/jest.js';
import nextConfig from './next.config.mjs';
// Match the public catalog injected into browser bundles by Next.
process.env.NEXT_PUBLIC_BLOG_IDS = nextConfig.env.NEXT_PUBLIC_BLOG_IDS;

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.mjs and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'jest-junit.xml' }]
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
