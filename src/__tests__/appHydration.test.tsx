import React from 'react';
// Node renderer avoids the browser renderer's TextEncoder requirement in jsdom.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderToString } = require('react-dom/server.node') as typeof import('react-dom/server');
import App from '@/pages/_app';

const mockRouter = { pathname: '/', asPath: '/' };
jest.mock('next/router', () => ({ useRouter: () => mockRouter }));
jest.mock('next/dynamic', () => () => () => null);
jest.mock('next-seo', () => ({ DefaultSeo: () => null, NextSeo: () => null }));
jest.mock('@vercel/analytics/react', () => ({ Analytics: () => null }));
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));
jest.mock('@/hooks/useAnalytics', () => ({ useAnalytics: () => undefined }));
jest.mock('@/elements/navbar', () => () => null);
// Keep transition wrappers, without browser-only animation effects during SSR.
jest.mock('framer-motion', () => ({
  LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  m: { div: ({ children }: { children: React.ReactNode }) => <div>{children}</div> },
  useReducedMotion: () => false,
}));

test('keeps server and initial browser page structure identical for direct anchor URLs', () => {
  const Component = () => <><script type="application/ld+json">{'{}'}</script><main>Contact</main></>;
  const props = {
    Component,
    pageProps: { pageMetadata: { enableWrap: true, layoutVariant: 'portfolio' as const, seoMetadata: {} } },
    router: mockRouter,
  } as unknown as React.ComponentProps<typeof App>;
  mockRouter.asPath = '/'; // URL fragments are unavailable to the server.
  const server = renderToString(<App {...props} />);
  mockRouter.asPath = '/#contact';
  expect(renderToString(<App {...props} />)).toBe(server);
});
