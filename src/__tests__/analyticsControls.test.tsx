import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CONSENT_KEY, readConsent, synchronizeConsent } from '@/util/analyticsConsent';

jest.mock('@vercel/analytics/react', () => ({ Analytics: () => null }));
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));

import { AnalyticsProvider } from '@/components/Analytics/AnalyticsProvider';
const Controls = () => AnalyticsProvider;
beforeEach(() => { localStorage.clear(); synchronizeConsent(true); });

test('offers independent consent, remembers choice and allows withdrawal through preferences', () => {
  const Component = Controls(); render(<Component />);
  fireEvent.click(screen.getByRole('button', {name:'Customize'}));
  fireEvent.click(screen.getByRole('checkbox', {name:'Analytics'}));
  fireEvent.click(screen.getByRole('button', {name:'Save preferences'}));
  expect(readConsent()).toMatchObject({analytics:true, advertising:false, decided:true});
  expect(screen.queryByRole('region', {name:'Privacy preferences'})).not.toBeInTheDocument();
  act(() => window.dispatchEvent(new Event('open-privacy-preferences')));
  fireEvent.click(screen.getByRole('button', {name:'Reject optional'}));
  expect(readConsent()).toMatchObject({analytics:false, advertising:false});
});

test('synchronizes consent changed in another tab', () => {
  const Component = Controls(); render(<Component />);
  localStorage.setItem(CONSENT_KEY, JSON.stringify({version:1, expires:Date.now()+10000, analytics:true, advertising:true}));
  act(() => window.dispatchEvent(new StorageEvent('storage', {key:CONSENT_KEY})));
  expect(screen.queryByRole('region', {name:'Privacy preferences'})).not.toBeInTheDocument();
});
