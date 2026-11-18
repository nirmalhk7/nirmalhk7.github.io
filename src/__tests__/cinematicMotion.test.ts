import { getCinematicFrame, mountCinematicMotion } from '@/components/Home/CinematicMotion';

// Catches wrong transition boundaries, stuck chapters, and missing endpoint clamps.
it.each([
  [0, 1, 0, 0, 0],
  [0.26, 0, 1, 0, 0],
  [0.43, 0, 1, 0.25, 1],
  [0.60, 0, 1, 0.50, 2],
  [0.77, 0, 1, 0.75, 3],
  [1.5, 0, 1, 1, 3],
  [-1, 1, 0, 0, 0],
  [NaN, 1, 0, 0, 0],
])('maps scroll progress %s to the visible introduction and engineering chapter', (progress, intro, engineering, path, stage) => {
  const frame = getCinematicFrame(progress);
  expect(frame.intro).toBeCloseTo(intro);
  expect(frame.engineering).toBeCloseTo(engineering);
  expect(frame.path).toBeCloseTo(path);
  expect(frame.stage).toBe(stage);
});

// Catches stale styles, hidden links, or event handlers surviving teardown/resize.
it('applies real scroll frames, reverses the story, and restores static content on disposal', () => {
  jest.useFakeTimers();
  const story = document.createElement('div');
  story.innerHTML = '<section data-story-intro><a href="/resume">Résumé</a></section><section data-story-engineering><ol><li data-story-stage>Product</li><li data-story-stage>Infrastructure</li><li data-story-stage>Security</li><li data-story-stage>AI</li></ol></section>';
  Object.defineProperty(story, 'offsetHeight', { value: window.innerHeight + 3000 });
  let top = 0;
  story.getBoundingClientRect = () => ({ top } as DOMRect);
  document.body.appendChild(story);
  const dispose = mountCinematicMotion(story);
  expect(story.dataset.cinematic).toBe('ready');
  expect(story.style.getPropertyValue('--intro-opacity')).toBe('1');
  top = -2400;
  window.dispatchEvent(new Event('scroll'));
  jest.runOnlyPendingTimers();
  expect(story.dataset.storyPhase).toBe('engineering');
  expect(story.querySelector('[data-story-intro]')).toHaveAttribute('inert');
  expect(story.querySelectorAll('[data-story-stage]:not([inert])')).toHaveLength(1);
  top = 0;
  window.dispatchEvent(new Event('scroll'));
  jest.runOnlyPendingTimers();
  expect(story.dataset.storyPhase).toBe('intro');
  expect(story.querySelector('[data-story-intro]')).not.toHaveAttribute('inert');
  dispose();
  expect(story.dataset.cinematic).toBeUndefined();
  expect(story.style.getPropertyValue('--intro-opacity')).toBe('');
  expect(story.querySelectorAll('[inert]')).toHaveLength(0);
  top = -3000;
  window.dispatchEvent(new Event('scroll'));
  jest.runOnlyPendingTimers();
  expect(story.style.getPropertyValue('--intro-opacity')).toBe('');
  story.remove();
  jest.useRealTimers();
});
