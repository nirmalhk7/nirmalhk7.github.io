import React, { useRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useProjectListMotion } from '@/hooks/useProjectListMotion';

function Explorer() {
  const [items, setItems] = useState(['alpha', 'beta', 'gamma']);
  const ref = useRef<HTMLDivElement>(null);
  const prepare = useProjectListMotion(ref);
  return <>
    <button onClick={() => { prepare(); setItems(['gamma', 'delta']); }}>Filter</button>
    <button onClick={() => { prepare(); setItems(['delta', 'alpha']); }}>Replace</button>
    <div ref={ref}>{items.map(id => <div data-project-motion-key={id} key={id}>{id}</div>)}</div>
  </>;
}

let reduced = false;
let preferenceChanged: (() => void) | undefined;
const animations: Array<{ cancel: jest.Mock; onfinish: (() => void) | null }> = [];
const animate = jest.fn(() => {
  const animation = { cancel: jest.fn(), onfinish: null as (() => void) | null };
  animations.push(animation);
  return animation;
});

beforeEach(() => {
  reduced = false;
  animations.length = 0;
  animate.mockClear();
  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() { return reduced; },
    addEventListener: (_: string, callback: () => void) => { preferenceChanged = callback; },
    removeEventListener: jest.fn(),
  }));
  Element.prototype.animate = animate as unknown as typeof Element.prototype.animate;
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const top = this.parentElement ? Array.from(this.parentElement.children).indexOf(this) * 100 : 0;
    return { top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: top, toJSON() {} };
  });
});
afterEach(() => { jest.restoreAllMocks(); });

test('moves surviving arbitrary slugs, fades new results, and removes filtered content immediately', () => {
  render(<Explorer />);
  expect(animate).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  expect(screen.queryByText('beta')).not.toBeInTheDocument();
  expect(screen.getByText('gamma')).toBeVisible();
  expect(screen.getByText('delta')).toBeVisible();
  expect(animate).toHaveBeenCalledWith([{ transform: 'translateY(200px)' }, { transform: 'translateY(0)' }], expect.objectContaining({ duration: 240 }));
  expect(animate).toHaveBeenCalledWith([{ opacity: 0 }, { opacity: 1 }], expect.objectContaining({ duration: 140 }));
});

test('cancels interrupted work and releases animations on unmount', () => {
  const { unmount } = render(<Explorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  const interrupted = [...animations];
  expect(interrupted.length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
  interrupted.forEach(animation => expect(animation.cancel).toHaveBeenCalledTimes(1));
  expect(screen.queryByText('gamma')).not.toBeInTheDocument();
  unmount();
  animations.forEach(animation => expect(animation.cancel).toHaveBeenCalledTimes(1));
});

test('uses immediate results for reduced motion and cancels when preference changes', () => {
  reduced = true;
  const { unmount } = render(<Explorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  expect(screen.getByText('delta')).toBeVisible();
  expect(animate).not.toHaveBeenCalled();
  unmount();
  reduced = false;
  render(<Explorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  expect(animations.length).toBeGreaterThan(0);
  act(() => { reduced = true; preferenceChanged?.(); });
  animations.forEach(animation => expect(animation.cancel).toHaveBeenCalledTimes(1));
});

test('keeps filtering usable without Web Animations support', () => {
  Object.defineProperty(Element.prototype, 'animate', { value: undefined, writable: true, configurable: true });
  render(<Explorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  expect(screen.getByText('delta')).toBeVisible();
  expect(screen.queryByText('beta')).not.toBeInTheDocument();
});

test('restarts an interrupted survivor from its current visual position', () => {
  render(<Explorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  const delta = screen.getByText('delta');
  const bounds = delta.getBoundingClientRect();
  const measure = delta.getBoundingClientRect.bind(delta);
  Object.defineProperty(delta, 'getBoundingClientRect', {
    value: jest.fn().mockImplementationOnce(() => ({ ...bounds, top: 150 })).mockImplementation(measure),
  });
  animate.mockClear();
  fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
  expect(animate).toHaveBeenCalledWith([{ transform: 'translateY(150px)' }, { transform: 'translateY(0)' }], expect.objectContaining({ duration: 240 }));
});
