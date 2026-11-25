import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
type Position = { top: number; opacity: number };
const projectRows = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>('[data-project-motion-key]'));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function savePositions(root: HTMLElement) {
  const positions = new Map<string, Position>();
  for (const row of projectRows(root)) {
    const key = row.dataset.projectMotionKey;
    if (key === undefined) continue;
    positions.set(key, {
      top: row.getBoundingClientRect().top + window.scrollY,
      opacity: Number(window.getComputedStyle(row).opacity || 1),
    });
  }
  return positions;
}

function animateProjects(root: HTMLElement, previous: Map<string, Position>, animations: Set<Animation>) {
  const measurements = projectRows(root).map(row => ({ row, top: row.getBoundingClientRect().top + window.scrollY }));
  const play = (row: HTMLElement, frames: Keyframe[], duration: number) => {
    const animation = row.animate(frames, { duration, easing });
    animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); };
  };
  for (const { row, top } of measurements) {
    const before = previous.get(row.dataset.projectMotionKey ?? '');
    const distance = before ? before.top - top : 0;
    if (Math.abs(distance) > 0.5) play(row, [{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }], 240);
    const opacity = before?.opacity ?? 0;
    if (opacity < 1) play(row, [{ opacity }, { opacity: 1 }], 140);
  }
}

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
    const root = ref.current;
    if (!root || typeof Element.prototype.animate !== 'function') return;
    if (!window.matchMedia || reducedMotion()) return;
    positions.current = savePositions(root);
  }, [ref]);

  useBrowserLayoutEffect(() => {
    const previous = positions.current;
    positions.current = null;
    if (!previous || !ref.current) return;
    // Snapshot visual positions before cancelling, then measure final layout in one batch.
    cancel();
    if (!reducedMotion()) animateProjects(ref.current, previous, animations.current);
  });

  return prepare;
}
