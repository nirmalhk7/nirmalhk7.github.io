import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { useContentReveal } from '@/hooks/useContentReveal';

function Content() {
  const ref = useRef<HTMLDivElement>(null);
  useContentReveal(ref);
  return <div ref={ref}><p data-reveal>Readable content</p></div>;
}

test('reveals intersecting content once without hiding content before observation', () => {
  let notify: IntersectionObserverCallback | undefined;
  const original = window.IntersectionObserver;
  window.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) { notify = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  try {
    const { unmount } = render(<Content />);
    const content = screen.getByText('Readable content');
    expect(content).toBeVisible();
    const entry: IntersectionObserverEntry = {
      target: content, isIntersecting: true, intersectionRatio: 1,
      boundingClientRect: content.getBoundingClientRect(),
      intersectionRect: content.getBoundingClientRect(), rootBounds: null, time: 0,
    };
    notify?.([entry], {} as IntersectionObserver);
    expect(content).toHaveAttribute('data-revealed', 'true');
    content.removeAttribute('data-revealed');
    notify?.([entry], {} as IntersectionObserver);
    expect(content).not.toHaveAttribute('data-revealed');
    unmount();
  } finally { window.IntersectionObserver = original; }
});

test('keeps content readable when IntersectionObserver is unavailable', () => {
  const original = window.IntersectionObserver;
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, writable: true, value: undefined });
  try {
    render(<Content />);
    expect(screen.getByText('Readable content')).toBeVisible();
  } finally { window.IntersectionObserver = original; }
});
