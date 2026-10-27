import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useReducedMotion } from 'framer-motion';
import RotatingTopics from '@/components/Home/RotatingTopics';

jest.mock('framer-motion', () => ({
  useReducedMotion: jest.fn(() => false),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  m: { span: ({ children, "data-testid": testId }: { children: React.ReactNode; "data-testid"?: string }) => <span data-testid={testId}>{children}</span> },
}));

test('cycles requested topics vertically and returns to infrastructure', () => {
  jest.useFakeTimers();
  const { unmount } = render(<RotatingTopics />);
  expect(screen.getByTestId('rotating-topic')).toHaveTextContent('infrastructure');
  for (const topic of ['products', 'software engineering', 'AI', 'agents', 'backend', 'fullstack', 'security', 'infrastructure']) {
    act(() => { jest.advanceTimersByTime(2600); });
    expect(screen.getByTestId('rotating-topic')).toHaveTextContent(topic);
  }
  unmount();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});

test('keeps infrastructure static when reduced motion is requested', () => {
  jest.mocked(useReducedMotion).mockReturnValue(true);
  jest.useFakeTimers();
  const { unmount } = render(<RotatingTopics />);
  expect(screen.getByTestId('rotating-topic')).toHaveTextContent('infrastructure');
  expect(jest.getTimerCount()).toBe(0);
  unmount();
  jest.useRealTimers();
  jest.mocked(useReducedMotion).mockReturnValue(false);
});
