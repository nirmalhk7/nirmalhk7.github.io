import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function mountCinematicMotion(story: HTMLDivElement): () => void {
  const photo = story.querySelector<HTMLElement>("[data-story-photo]");
  const copy = story.querySelector<HTMLElement>("[data-story-copy]");
  const credit = story.querySelector<HTMLElement>("[data-story-credit]");
  const engineering = story.querySelector<HTMLElement>("[data-story-engineering]");
  const path = story.querySelector<SVGPathElement>("[data-story-path]");
  const nodes = Array.from(story.querySelectorAll<SVGCircleElement>("[data-story-node]"));
  const stages = Array.from(story.querySelectorAll<HTMLElement>("[data-story-stage]"));

  if (!photo || !copy || !engineering || !path || nodes.length !== 4 || stages.length !== 4) {
    return () => undefined;
  }

  story.dataset.cinematic = "ready";

  const context = gsap.context(() => {
    const routeLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: routeLength, strokeDashoffset: routeLength });
    gsap.set(nodes, { opacity: 0, scale: 0.65, transformOrigin: "center center" });
    gsap.set(stages, { opacity: 0, y: 38 });

    const sequence = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: story,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.28,
        invalidateOnRefresh: true,
      },
    });

    sequence
      .to(photo, { scale: 1.12, duration: 1.3 }, 0)
      .to(copy, { opacity: 0, y: -38, duration: 0.48 }, 0.52)
      .to(photo, { clipPath: "inset(6% 3% 6% 49%)", duration: 0.95 }, 0.74)
      .to(engineering, { opacity: 1, duration: 0.42 }, 1.35)
      .to(photo, { xPercent: 110, opacity: 0, duration: 0.68 }, 2.45)
      .to(path, { strokeDashoffset: 0, duration: 3.4 }, 3.08);

    if (credit) sequence.to(credit, { opacity: 0, duration: 0.2 }, 0.6);

    stages.forEach((stage, index) => {
      const enter = 3.12 + index * 0.88;
      sequence.to(nodes[index], { opacity: 1, scale: 1, duration: 0.18 }, enter);
      sequence.to(stage, { opacity: 1, y: 0, duration: 0.35 }, enter);
      if (index < stages.length - 1) {
        sequence.to(stage, { opacity: 0, y: -34, duration: 0.32 }, enter + 0.62);
      }
    });
    sequence.to(stages[3], { opacity: 1, duration: 0.72 }, 6.46);
    ScrollTrigger.refresh();
  }, story);

  return () => {
    context.revert();
    delete story.dataset.cinematic;
  };
}
