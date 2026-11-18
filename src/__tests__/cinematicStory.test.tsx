import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CinematicStory from '@/components/Home/CinematicStory';

jest.mock('next/image', () => ({ __esModule: true, default: () => null }));

// Catches missing static positioning, duplicate positioning, or broken hero destinations.
it('renders a concise hero with work, résumé, and contact actions before motion loads', () => {
  const document = new DOMParser().parseFromString(renderToStaticMarkup(<CinematicStory />), 'text/html');
  const hero = document.querySelector('#max-jumbo');
  if (!hero) throw new Error('Missing hero');
  expect(hero.querySelectorAll('h1')).toHaveLength(1);
  expect(hero.querySelector('h1')?.textContent).toContain('I BUILD & SHIP BACKEND SYSTEMS.');
  expect(hero.textContent).toContain('Visa · ZOLL Data Systems · NITK Surathkal · MS CS, CU Boulder');
  expect(hero.textContent).not.toContain('Backend & infrastructure engineer.');
  expect(Array.from(hero.querySelectorAll('a')).map(link => [link.textContent, link.getAttribute('href')])).toEqual([
    ['View work', '#workexperience'], ['Résumé', '/resume'], ['Contact', '#contact'],
  ]);
  expect(document.querySelectorAll('section')).toHaveLength(1);
  expect(document.querySelector('[style*="opacity:0"]')).toBeNull();
});
