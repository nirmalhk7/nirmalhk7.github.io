import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../elements/navbar';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

describe('Navbar Component', () => {
  it('renders the brand name correctly', () => {
    render(<Navbar />);
    const brandElement = screen.getByText(/nirmalhk7/i);
    expect(brandElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
