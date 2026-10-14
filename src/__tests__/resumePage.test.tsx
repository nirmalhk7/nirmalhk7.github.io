import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HiringLinks from '@/components/Site/HiringLinks';
import ResumePage from '@/pages/resume';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- Exercise the same configuration Next loads.
const nextConfig = require('../../next.config.js');

test.each(['development', 'production'])('/resume stays an embedded page in %s', async environment => {
  const env = process.env as { NODE_ENV?: string }; const previous = env.NODE_ENV; env.NODE_ENV = environment;
  try {
    const redirects = await nextConfig.redirects();
    expect(redirects.some((redirect: { source: string }) => ['/resume', '/en-US/resume'].includes(redirect.source))).toBe(false);
  } finally { env.NODE_ENV = previous; }
});

test('shows embedded résumé immediately', () => {
  render(<ResumePage />);
  expect(screen.getByTitle('Nirmal Khedkar résumé')).toHaveAttribute('src', expect.stringContaining('/Resume.pdf'));
});

test('hiring résumé link opens /resume and records a view instead of a download', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  render(<HiringLinks />); const link = screen.getByRole('link', { name: 'View résumé' });
  expect(link).toHaveAttribute('href', '/resume');
  link.addEventListener('click', event => event.preventDefault()); fireEvent.click(link);
  expect(spy).toHaveBeenCalledWith('[Analytics] select_content', expect.objectContaining({ content_type: 'resume', source: 'contact_link' }));
  expect(spy.mock.calls.filter(call => call[0] === '[Analytics] file_download')).toHaveLength(0);
  spy.mockRestore();
});
