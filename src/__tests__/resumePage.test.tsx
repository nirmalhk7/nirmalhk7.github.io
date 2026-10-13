import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ResumePage, { getStaticProps } from '@/pages/resume';

jest.mock('@/util/analytics', () => ({ trackEvent: jest.fn(), trackSelectContent: jest.fn() }));

test('keeps sourced experience and education readable without a PDF preview', async () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  const result = await getStaticProps({});
  if (!('props' in result)) throw new Error('Missing résumé props');
  const props = await result.props;
  render(<ResumePage {...props} />);
  expect(screen.getByRole('heading', { name: 'ZOLL Data Systems' })).toBeInTheDocument();
  expect(screen.getByText('National Institute of Technology Karnataka, Surathkal')).toBeInTheDocument();
  expect(screen.getByText('Bachelor of Technology in Information Technology')).toBeInTheDocument();
  expect(screen.getByText('July 2018 – May 2022')).toBeInTheDocument();
  expect(screen.getByText(/Kubernetes, Terraform, and FluxCD/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('download', 'Nirmal-Khedkar-Resume.pdf');
  expect(screen.queryByTitle('Resume of Nirmal Khedkar')).not.toBeInTheDocument();
});

test('offers permanent PDF fallback while the optional preview loads', async () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  const result = await getStaticProps({});
  if (!('props' in result)) throw new Error('Missing résumé props');
  render(<ResumePage {...await result.props} />);
  fireEvent.click(screen.getByRole('button', { name: 'Preview PDF' }));
  expect(screen.getByRole('status')).toHaveTextContent('Loading PDF preview');
  expect(screen.getByText(/Some browsers cannot display embedded PDFs/)).toBeInTheDocument();
  fireEvent.load(screen.getByTitle('Resume of Nirmal Khedkar'));
  expect(screen.getByRole('status')).toHaveTextContent('Preview loaded');
  expect(screen.getByText(/Some browsers cannot display embedded PDFs/)).toBeInTheDocument();
});
