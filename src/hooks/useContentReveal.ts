import { RefObject, useEffect } from 'react';

// Content stays visible until it enters; a failed script never leaves a blank section.
export function useContentReveal(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const revealed = new WeakSet<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || revealed.has(target)) return;
        revealed.add(target);
        target.setAttribute('data-revealed', 'true');
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    root.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ref]);
}
