import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Navbar from '../elements/navbar';
import '@testing-library/jest-dom';

const mockRouter = { pathname: '/', push: jest.fn().mockResolvedValue(true) };
jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

describe('Navbar Component', () => {
  beforeEach(() => { mockRouter.pathname = '/'; });
  it('reveals after the hero boundary and hides again when returning to it', () => {
    jest.useFakeTimers();
    const story = document.createElement('div');
    story.setAttribute('data-navigation-story', '');
    const hero = document.createElement('section');
    hero.id = 'max-jumbo';
    Object.defineProperty(hero, 'offsetHeight', { value: 900 });
    let top = 0;
    story.getBoundingClientRect = () => ({ top } as DOMRect);
    story.appendChild(hero);
    document.body.appendChild(story);
    const { container, unmount } = render(<Navbar variant="portfolio" />);
    const header = container.querySelector('header');
    expect(header).toHaveAttribute('data-visible', 'false');
    top = -900;
    act(() => { fireEvent.scroll(window); jest.runOnlyPendingTimers(); });
    expect(header).toHaveAttribute('data-visible', 'true');
    top = -899;
    act(() => { fireEvent.scroll(window); jest.runOnlyPendingTimers(); });
    expect(header).toHaveAttribute('data-visible', 'false');
    unmount();
    story.remove();
    jest.useRealTimers();
  });
  it('keeps archive navigation and current page semantics correct on inner routes', () => {
    mockRouter.pathname = '/projects';
    render(<Navbar variant="portfolio" />);
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
    expect(screen.getByRole('link', { name: 'Resume' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('href','/resume');
  });
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
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    await waitFor(() => expect(menuButton).toHaveFocus());
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.body.style.overflow).toBe('');
  });
});

test('records mobile navigation opening and Escape closure',()=>{
  mockRouter.pathname='/projects';
  const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  render(<Navbar variant="portfolio" />);
  fireEvent.click(screen.getByRole('button',{name:'Open navigation menu'}));
  expect(spy).toHaveBeenCalledWith('[Analytics] navigation_menu',expect.objectContaining({action:'open',placement:'portfolio'}));
  fireEvent.keyDown(document,{key:'Escape'});
  expect(spy).toHaveBeenCalledWith('[Analytics] navigation_menu',expect.objectContaining({action:'close',placement:'portfolio'}));
  spy.mockRestore();
});
