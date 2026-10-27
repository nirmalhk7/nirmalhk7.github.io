import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
type Position = { top: number; opacity: number };

/** Capture before a filter update; animate only the resulting project-list commit. */
export function useProjectListMotion(ref: RefObject<HTMLElement>) {
  const positions = useRef<Map<string, Position> | null>(null);
  const animations = useRef(new Set<Animation>());

  const cancel = useCallback(() => {
    animations.current.forEach(animation => animation.cancel());
    animations.current.clear();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handlePreference = () => {
      if (preference?.matches) {
        positions.current = null;
        cancel();
      }
    };
    preference?.addEventListener('change', handlePreference);
    return () => {
      preference?.removeEventListener('change', handlePreference);
      cancel();
    };
  }, [cancel]);

  const prepare = useCallback(() => {
    positions.current = null;
    if (!ref.current || typeof Element.prototype.animate !== 'function' ||
      !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const next = new Map<string, Position>();
    ref.current.querySelectorAll<HTMLElement>('[data-project-motion-key]').forEach(row => {
      const key = row.dataset.projectMotionKey;
      if (key === undefined) return;
      next.set(key, {
        top: row.getBoundingClientRect().top + window.scrollY,
        opacity: Number(window.getComputedStyle(row).opacity || 1),
      });
    });
    positions.current = next;
  }, [ref]);

  useBrowserLayoutEffect(() => {
    const previous = positions.current;
    positions.current = null;
    if (!previous || !ref.current) return;
    // Snapshot visual positions before cancelling, then measure final layout in one batch.
    cancel();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rows = Array.from(ref.current.querySelectorAll<HTMLElement>('[data-project-motion-key]'));
    const measurements = rows.map(row => ({ row, top: row.getBoundingClientRect().top + window.scrollY }));
    const play = (row: HTMLElement, frames: Keyframe[], duration: number) => {
      const animation = row.animate(frames, { duration, easing });
      animations.current.add(animation);
      animation.onfinish = () => { animations.current.delete(animation); };
    };
    measurements.forEach(({ row, top }) => {
      const before = previous.get(row.dataset.projectMotionKey ?? '');
      if (before) {
        const distance = before.top - top;
        if (Math.abs(distance) > 0.5) {
          play(row, [{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }], 240);
        }
      }
      const opacity = before?.opacity ?? 0;
      if (opacity < 1) play(row, [{ opacity }, { opacity: 1 }], 140);
    });
  });

  return prepare;
}
