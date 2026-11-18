const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function getCinematicFrame(progress: number) {
  const value = Number.isFinite(progress) ? clamp(progress) : 0;
  const path = clamp((value - 0.26) / 0.68);
  return {
    intro: 1 - clamp(value / 0.18),
    engineering: clamp((value - 0.14) / 0.1),
    portrait: clamp((value - 0.04) / 0.24),
    path,
    stage: Math.min(3, Math.floor(path * 4 + 0.000001)),
  };
}

// One scroll-driven composition; no timer loop or motion dependency is needed.
export function mountCinematicMotion(story: HTMLDivElement): () => void {
  const intro = story.querySelector<HTMLElement>('[data-story-intro]');
  const engineering = story.querySelector<HTMLElement>('[data-story-engineering]');
  const stages = Array.from(story.querySelectorAll<HTMLElement>('[data-story-stage]'));
  let request = 0;
  const properties = ['--intro-opacity', '--engineering-opacity', '--portrait-progress', '--route-progress'];
  const previousInert = [intro, engineering, ...stages].map(element => [element, element?.hasAttribute('inert')] as const);
  const update = () => {
    const distance = Math.max(1, story.offsetHeight - window.innerHeight);
    const frame = getCinematicFrame(-story.getBoundingClientRect().top / distance);
    story.style.setProperty('--intro-opacity', String(frame.intro));
    story.style.setProperty('--engineering-opacity', String(frame.engineering));
    story.style.setProperty('--portrait-progress', String(frame.portrait));
    story.style.setProperty('--route-progress', String(frame.path));
    story.dataset.activeStage = String(frame.stage);
    const phase = frame.intro > 0.01 ? 'intro' : 'engineering';
    const changed = story.dataset.storyPhase !== phase;
    story.dataset.storyPhase = phase;
    intro?.toggleAttribute('inert', phase !== 'intro');
    engineering?.toggleAttribute('inert', frame.engineering < 0.99);
    stages.forEach((stage, index) => stage.toggleAttribute('inert', index !== frame.stage));
    if (changed) window.dispatchEvent(new Event('portfolio-hero-tone'));
  };
  const schedule = () => {
    cancelAnimationFrame(request);
    request = requestAnimationFrame(update);
  };
  story.dataset.cinematic = 'ready';
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  return () => {
    cancelAnimationFrame(request);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    properties.forEach(property => story.style.removeProperty(property));
    delete story.dataset.cinematic;
    delete story.dataset.storyPhase;
    delete story.dataset.activeStage;
    previousInert.forEach(([element, inert]) => element?.toggleAttribute('inert', Boolean(inert)));
    window.dispatchEvent(new Event('portfolio-hero-tone'));
  };
}
