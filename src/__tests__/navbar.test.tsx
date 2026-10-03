import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

  it('traps focus in the portfolio menu and restores focus when Escape closes it', async () => {
    render(<Navbar variant="portfolio" />);
    const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });

    fireEvent.click(menuButton);
    const mobileMenu = screen.getByRole('navigation', { name: 'Mobile navigation' });
    const menu = within(mobileMenu);
    const closeButton = menu.getByRole('button', { name: 'Close navigation menu' });
    const searchButton = menu.getByRole('button', { name: /Search/ });

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(searchButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(menuButton).toHaveFocus());
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.body.style.overflow).toBe('');
  });
});
