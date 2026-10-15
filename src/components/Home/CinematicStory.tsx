import { useContentReveal } from "@/hooks/useContentReveal";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackSelectContent, trackResumeOpen } from "@/util/analytics";
import beachPhoto from "@/assets/images/BeachNK_1.jpg";
import styles from "./cinematicStory.styles";

const stages = [
  {
    name: "Product",
    headline: "Product thinking.",
    emphasis: "Human focus.",
    detail: "I turn complex problems into experiences that feel simple.",
  },
  {
    name: "Infrastructure",
    headline: "Strong foundations.",
    emphasis: "Built to grow.",
    detail: "I build the systems behind the experience, with reliability at the center.",
  },
  {
    name: "Security",
    headline: "Security in mind.",
    emphasis: "From the start.",
    detail: "I bring a security mindset to the choices that shape a system.",
  },
  {
    name: "AI",
    headline: "AI with purpose.",
    emphasis: "Possibility, applied.",
    detail: "I put AI to work where it helps people make better decisions.",
  },
];

export default function CinematicStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  useContentReveal(storyRef);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)");
    let dispose: (() => void) | undefined;
    let request = 0;

    const syncMotion = () => {
      const currentRequest = ++request;
      dispose?.();
      dispose = undefined;
      if (!query.matches) return;
      import("./CinematicMotion").then(({ mountCinematicMotion }) => {
        if (currentRequest === request && query.matches) {
          dispose = mountCinematicMotion(story);
          // Anchor positions change when the optional cinematic layout expands.
          window.dispatchEvent(new Event("portfolio-layout-ready"));
        }
      }).catch(() => {
        // Static content remains visible if the optional motion chunk fails to load.
      });
    };

    syncMotion();
    query.addEventListener("change", syncMotion);
    return () => {
      request++;
      query.removeEventListener("change", syncMotion);
      dispose?.();
    };
  }, []);

  return (
    <div className={styles.story} ref={storyRef} data-navigation-story>
      <div className={styles.frame}>
        <section className={styles.hero} id="max-jumbo" aria-labelledby="hero-heading">
          <div className={styles.photograph} data-story-photo aria-hidden="true">
            <Image src={beachPhoto} alt="" fill priority sizes="100vw" className={styles.heroImage} />
          </div>
          <div data-reveal className={styles.heroCopy} data-story-copy>
            <p className={styles.heroName}>Nirmal Khedkar</p>
            <h1 id="hero-heading">
              <span className={styles.displayName} aria-hidden="true">I BUILD &amp; SHIP BACKEND SYSTEMS.</span>
              <span className={styles.srOnly}>Nirmal Khedkar. I build and ship backend systems.</span>
            </h1>
            <p className={styles.positioning}>Backend &amp; infrastructure engineer.</p>
            <p className={styles.range}>Production services at Visa. Dispatch software at ZOLL. Kubernetes tooling in my projects.</p>
            <p className={styles.proof}>Visa · ZOLL Data Systems · NITK Surathkal · MS CS, CU Boulder</p>
            <div className={styles.actions}>
              <Link data-analytics-skip-global="true"
                className={styles.primaryAction}
                href="#workexperience"
                onClick={() => {
                  trackSelectContent("hero_cta", "View work", { destination: "#workexperience" });
                }}
              >
                View work
              </Link>
              <Link data-analytics-skip-global="true"
                href="/resume"
                onClick={() => trackResumeOpen("hero_cta")}
              >
                Resume
              </Link>
              <Link data-analytics-skip-global="true"
                href="#contact"
                onClick={() => {
                  trackSelectContent("lead_cta", "want_to_hire");
                }}
              >
                Contact
              </Link>
            </div>
          </div>
          <p className={styles.photoCredit} data-story-credit>Nirmal Khedkar · California coast</p>
        </section>

        <section className={styles.engineering} aria-labelledby="engineering-heading" data-story-engineering>
          <header data-reveal className={styles.engineeringHeader}>
            <h2 id="engineering-heading">Built for the real world.</h2>
            <p>I connect product thinking with engineering depth. From the first idea to the systems behind it.</p>
          </header>
          <div className={styles.systemMap} aria-hidden="true">
            <svg viewBox="0 0 700 700" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path className={styles.routeBase} d="M 0 365 H 124 V 190 H 300 V 302 H 460 V 506 H 610" />
              <path className={styles.routeActive} data-story-path d="M 0 365 H 124 V 190 H 300 V 302 H 460 V 506 H 610" />
              <circle data-story-node cx="124" cy="365" r="12" />
              <circle data-story-node cx="300" cy="190" r="12" />
              <circle data-story-node cx="460" cy="302" r="12" />
              <circle data-story-node cx="610" cy="506" r="12" />
            </svg>
          </div>
          <ol className={styles.stages}>
            {stages.map((stage) => (
              <li data-reveal className={styles.stage} data-story-stage key={stage.name}>
                <h3>{stage.headline}<span>{stage.emphasis}</span></h3>
                <p>{stage.detail}</p>
              </li>
            ))}
          </ol>
          <div data-reveal className={styles.engineeringFoot}>
            <p>Big-picture thinking. Hands-on building.</p>
            <Link data-analytics-skip-global="true" href="#workexperience" onClick={() => trackSelectContent("engineering_cta", "See my experience", { destination: "#workexperience" })}>
              See my experience
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
