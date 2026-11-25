import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { NextRouter } from 'next/router';
import { trackClick, trackEvent } from '@/util/analytics';

export function useNavigationMenuEvent(open: boolean, placement: 'legacy' | 'portfolio') {
  const previous = useRef(false);
  useEffect(() => {
    if (previous.current === open) return;
    trackEvent('navigation_menu', { action: open ? 'open' : 'close', placement });
    previous.current = open;
  }, [open, placement]);
}

export function scrollLegacyAnchor(event: MouseEvent<HTMLAnchorElement>, route: string, pathname: string) {
  if (route === '/') {
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const onPage = route.startsWith('#') || (route.startsWith('/#') && pathname === '/');
  if (!onPage) return;
  const id = route.split('#')[1];
  if (!id) return;
  event.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', route);
  }
}

function alignPortfolioAnchor(id: string) {
  let attempts = 0;
  const align = () => {
    const target = document.getElementById(id);
    if (target) {
      const style = document.documentElement.style;
      const previous = style.scrollBehavior;
      style.scrollBehavior = 'auto';
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      requestAnimationFrame(() => { style.scrollBehavior = previous; });
    } else if (attempts++ < 120) {
      requestAnimationFrame(align);
    }
  };
  requestAnimationFrame(align);
}

function plainClick(event: MouseEvent<HTMLAnchorElement>) {
  const hasCommandModifier = event.metaKey || event.ctrlKey;
  const hasOtherModifier = event.shiftKey || event.altKey;
  return event.button === 0 && !hasCommandModifier && !hasOtherModifier;
}

export function visitPortfolioSection(event: MouseEvent<HTMLAnchorElement>, route: string, router: NextRouter) {
  trackClick(route, 'navbar_link');
  if (!route.startsWith('/#') || router.pathname === '/' || !plainClick(event)) return;
  event.preventDefault();
  void router.push(route).then(() => alignPortfolioAnchor(route.slice(2)));
}
