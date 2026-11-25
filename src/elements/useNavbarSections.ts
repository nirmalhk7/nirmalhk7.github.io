import { useEffect, useState } from 'react';
import { createRafThrottled } from '@/util/rafThrottle';

const portfolioSections = ['max-jumbo', 'about', 'workexperience', 'project', 'blog', 'contact'];

function observePortfolioSections(setActive: (id: string) => void) {
  const observer = new IntersectionObserver(entries => {
    const [visible] = entries.filter(entry => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75] });
  portfolioSections.forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
  return () => observer.disconnect();
}

function resolveLegacySection(sectionIds: string[]) {
  const viewportMarker = window.scrollY + 140;
  const documentBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
  const sections = sectionIds.map(id => document.getElementById(id))
    .filter((section): section is HTMLElement => Boolean(section));
  if (documentBottom && sections.some(section => section.id === 'contact')) return 'contact';
  const active = sections.reduce<HTMLElement | null>((previous, section) =>
    section.offsetTop <= viewportMarker ? section : previous, null);
  return active?.id || '';
}

function listenForLegacySections(sectionIds: string[], setActive: (id: string) => void) {
  const update = () => setActive(resolveLegacySection(sectionIds));
  update();
  const timeout = window.setTimeout(update, 500);
  const scheduled = createRafThrottled(update);
  window.addEventListener('scroll', scheduled, { passive: true });
  window.addEventListener('resize', scheduled);
  return () => {
    window.clearTimeout(timeout);
    window.removeEventListener('scroll', scheduled);
    window.removeEventListener('resize', scheduled);
    scheduled.cancel();
  };
}

function activeRoute(pathname: string) {
  if (pathname.startsWith('/projects')) return 'project';
  return pathname.startsWith('/blog') ? 'blog' : '';
}

export function useNavbarSections(pathname: string, portfolio: boolean, legacySections: string[]) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (portfolio && pathname === '/') return observePortfolioSections(setActive);
  }, [portfolio, pathname]);
  useEffect(() => {
    if (pathname !== '/') {
      setActive(activeRoute(pathname));
    } else if (!portfolio) {
      return listenForLegacySections(legacySections, setActive);
    }
  }, [pathname, portfolio, legacySections]);
  return active;
}

export function useLegacyNavbarScroll(portfolio: boolean, pathname: string) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (portfolio) return;
    const update = () => {
      const hero = document.getElementById('max-jumbo') || document.getElementById('hero-header') || document.querySelector<HTMLElement>('.page-header');
      const height = hero ? hero.offsetHeight : window.innerHeight;
      setScrolled(window.scrollY >= height - 80);
    };
    const scheduled = createRafThrottled(update);
    window.addEventListener('scroll', scheduled, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', scheduled); scheduled.cancel(); };
  }, [portfolio, pathname]);
  return scrolled;
}
