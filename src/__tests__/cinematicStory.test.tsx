import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CinematicStory from '@/components/Home/CinematicStory';

jest.mock('next/image', () => ({ __esModule: true, default: () => null }));

// Catches missing static positioning, duplicate positioning, or broken hero destinations.
it('introduces Nirmal with work, résumé, and contact actions before motion loads', () => {
  const document = new DOMParser().parseFromString(renderToStaticMarkup(<CinematicStory />), 'text/html');
  const hero = document.querySelector('#max-jumbo');
  if (!hero) throw new Error('Missing hero');
  expect(hero.querySelectorAll('h1')).toHaveLength(1);
  expect(hero.querySelector('h1')?.textContent).toContain('Nirmal Khedkar');
  expect(hero.textContent).toContain('Visa · ZOLL Data Systems · NITK Surathkal · MS CS, CU Boulder');
  expect(Array.from(hero.querySelectorAll('a')).map(link => [link.textContent, link.getAttribute('href')])).toEqual([
    ['View work', '#workexperience'], ['Résumé', '/resume'], ['Contact', '#contact'],
  ]);
  expect(document.querySelectorAll('section')).toHaveLength(2);
  expect(document.querySelector('[style*="opacity:0"]')).toBeNull();
});

// Catches the product-style story being removed or losing its real-work destinations.
it('renders four engineering chapters with concrete work available before motion loads', () => {
  const document = new DOMParser().parseFromString(renderToStaticMarkup(<CinematicStory />), 'text/html');
  const chapters = Array.from(document.querySelectorAll('[aria-label="Engineering disciplines"] > li'));
  expect(chapters).toHaveLength(4);
  expect(chapters.map(chapter => chapter.querySelector('a')?.getAttribute('href'))).toEqual([
    '/projects?id=scholarhub', '#workexperience', '#workexperience', '/projects?id=whirlwind',
  ]);
  for (const chapter of chapters) {
    expect(chapter.querySelector('h3')?.textContent).toBeTruthy();
    expect(chapter.querySelector('p')?.textContent).toBeTruthy();
  }
});
