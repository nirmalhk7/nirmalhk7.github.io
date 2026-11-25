import { useEffect, useRef, useState } from 'react';
import { createRafThrottled } from '@/util/rafThrottle';
import { wrapTabFocus } from '@/util/wrapTabFocus';
import { useNavigationMenuEvent } from './navigationInteraction';

function heroBoundary(hero: HTMLElement | null) {
  // The cinematic hero stays pinned, so its first viewport is the navigation boundary.
  const story = hero?.closest<HTMLElement>('[data-navigation-story]');
  return story && hero ? story.getBoundingClientRect().top + hero.offsetHeight : hero?.getBoundingClientRect().bottom;
}

function useOverHero(pathname: string, open: boolean) {
  const [overHero, setOverHero] = useState(true);
  useEffect(() => {
    const hero = document.getElementById('max-jumbo') || document.querySelector<HTMLElement>('[data-navigation-hero]');
    const update = () => {
      const boundary = heroBoundary(hero);
      setOverHero(!open && boundary !== undefined && boundary > 0);
    };
    const schedule = createRafThrottled(update);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      schedule.cancel();
    };
  }, [pathname, open]);
  return overHero;
}

function lockMenuFocus(menu: HTMLElement | null, close: () => void) {
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
  focusable?.[0]?.focus();
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
    if (focusable) wrapTabFocus(event, focusable);
  };
  document.addEventListener('keydown', onKeyDown);
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = previousOverflow;
  };
}

export function usePortfolioMenu(pathname: string) {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  useNavigationMenuEvent(menuOpen, 'portfolio');
  const overHero = useOverHero(pathname, menuOpen);
  useEffect(() => {
    if (menuOpen) {
      wasOpen.current = true;
      return lockMenuFocus(menuRef.current, () => setMenuOpen(false));
    }
    if (wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = false;
  }, [menuOpen]);
  return { menuOpen, setMenuOpen, overHero, triggerRef, menuRef };
}
