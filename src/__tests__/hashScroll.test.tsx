import React from 'react';
import { act, render } from '@testing-library/react';
import { useHashScroll } from '@/hooks/useHashScroll';

function Page({ route = "/#workexperience" }: { route?: string }) {
  useHashScroll(route);
  return <section id="workexperience">Experience</section>;
}

beforeEach(() => {
  jest.useFakeTimers();
  window.history.replaceState(null, '', '/#workexperience');
  Element.prototype.scrollIntoView = jest.fn();
});
afterEach(() => {
  jest.useRealTimers();
  window.history.replaceState(null, '', '/');
});

test('aligns a direct hash URL once the page has mounted without smooth-scroll competition', () => {
  render(<Page />);
  act(() => { jest.runOnlyPendingTimers(); });
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
});

test('aligns native hash changes and ignores missing or malformed targets', () => {
  render(<Page />);
  act(() => { jest.runOnlyPendingTimers(); });
  jest.mocked(Element.prototype.scrollIntoView).mockClear();
  act(() => {
    window.history.replaceState(null, '', '/#%77orkexperience');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    jest.runOnlyPendingTimers();
  });
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  act(() => {
    window.history.replaceState(null, '', '/#missing');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    jest.runOnlyPendingTimers();
    window.history.replaceState(null, '', '/#%');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    jest.runOnlyPendingTimers();
  });
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
});

test('cancels pending alignment on unmount', () => {
  const { unmount } = render(<Page />);
  unmount();
  act(() => { jest.runOnlyPendingTimers(); });
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
});

 test('aligns client route changes after the entering page commits', () => {
  window.history.replaceState(null, '', '/');
  const { rerender } = render(<Page route="/" />);
  act(() => { jest.runOnlyPendingTimers(); });
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  window.history.replaceState(null, '', '/#workexperience');
  rerender(<Page route="/#workexperience" />);
  act(() => { jest.runOnlyPendingTimers(); });
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
});

test('realigns when the cinematic intro finishes expanding', () => {
  render(<Page />);
  act(() => { jest.runOnlyPendingTimers(); });
  jest.mocked(Element.prototype.scrollIntoView).mockClear();
  act(() => {
    window.dispatchEvent(new Event('portfolio-layout-ready'));
    jest.runOnlyPendingTimers();
  });
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
});
