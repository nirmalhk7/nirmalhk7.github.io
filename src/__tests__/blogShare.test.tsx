import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BlogShare from '@/components/Blog/BlogShare';

describe('blog sharing', () => {
  const writeText = jest.fn();
  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    window.history.replaceState({}, '', '/blog/homelab_architect?utm_source=old#heading');
  });
  afterEach(() => jest.restoreAllMocks());

  it('provides platform composers with fresh campaign tags on canonical production URLs', () => {
    render(<BlogShare slug="homelab_architect" title="Homelab & architecture" />);
    for (const [name, source, parameter] of [
      ['X', 'x', 'url'], ['Facebook', 'facebook', 'u'], ['LinkedIn', 'linkedin', 'url'], ['Bluesky', 'bluesky', 'text'],
    ]) {
      const link = screen.getByRole('link', { name: `Share on ${name}` });
      const composer = new URL(link.getAttribute('href')!);
      const value = composer.searchParams.get(parameter)!;
      const shared = new URL(source === 'bluesky' ? value.split('\n\n')[1] : value);
      expect(shared.origin + shared.pathname).toBe('https://nirmalhk7.com/blog/homelab_architect');
      expect(Object.fromEntries(shared.searchParams)).toEqual({
        utm_source: source, utm_medium: 'social', utm_campaign: 'blog_share',
        utm_content: 'article_footer', utm_term: 'homelab_architect',
      });
      expect(shared.hash).toBe('');
    }
    expect(screen.getByRole('button', { name: 'Copy link for Instagram' })).toBeInTheDocument();
  });

  it('records article, destination, placement and time for composer clicks', () => {
    render(<BlogShare slug="homelab_architect" title="Homelab" />);
    const link = screen.getByRole('link', { name: 'Share on X' });
    link.addEventListener('click', event => event.preventDefault());
    fireEvent.click(link);
    expect(console.log).toHaveBeenCalledWith('[Analytics] share', expect.objectContaining({
      method: 'x', item_id: 'homelab_architect', content_type: 'blog_post',
      share_action: 'composer_opened', share_placement: 'article_footer',
      shared_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      utm_source: 'x', utm_medium: 'social', utm_campaign: 'blog_share',
    }));
  });

  it('copies Instagram-tagged link and announces manual posting instructions', async () => {
    render(<BlogShare slug="homelab_architect" title="Homelab" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy link for Instagram' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Instagram link copied'));
    expect(writeText).toHaveBeenCalledWith('https://nirmalhk7.com/blog/homelab_architect?utm_source=instagram&utm_medium=social&utm_campaign=blog_share&utm_content=article_footer&utm_term=homelab_architect');
    expect(console.log).toHaveBeenCalledWith('[Analytics] share', expect.objectContaining({ method: 'instagram', share_action: 'link_copied' }));
  });

  it('offers selectable tagged URL when clipboard fails without reporting a successful share', async () => {
    writeText.mockRejectedValue(new Error('Clipboard denied'));
    render(<BlogShare slug="homelab_architect" title="Homelab" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Share link to copy' })).toBeInTheDocument());
    expect(screen.getByRole('textbox')).toHaveValue('https://nirmalhk7.com/blog/homelab_architect?utm_source=copy&utm_medium=referral&utm_campaign=blog_share&utm_content=article_footer&utm_term=homelab_architect');
    expect(console.log).not.toHaveBeenCalledWith('[Analytics] share', expect.anything());
    expect(console.log).toHaveBeenCalledWith('[Analytics] share_error', expect.objectContaining({ method: 'copy' }));
  });
});
