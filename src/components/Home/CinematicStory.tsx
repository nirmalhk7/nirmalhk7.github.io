import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackSelectContent, trackResumeOpen } from "@/util/analytics";
import beachPhoto from "@/assets/images/BeachNK_1.jpg";
import styles from "./cinematicStory.module.scss";

const chapters = [
  {
    title: "Product thinking.", emphasis: "Human focus.",
    detail: "I built the entire ScholarHub frontend: a research and collaboration portal for NIT students.",
    proof: "Explore ScholarHub", href: "/projects?id=scholarhub",
  },
  {
    title: "Strong foundations.", emphasis: "Built to grow.",
    detail: "At Visa, I redesigned blocking services into non-blocking Reactor pipelines and worked on production releases.",
    proof: "See my work at Visa", href: "#workexperience",
  },
  {
    title: "Security in mind.", emphasis: "From the start.",
    detail: "I built CI/CD security gates across eight Visa services using SAST, DAST, dependency scanning, and SonarQube.",
    proof: "Explore my experience", href: "#workexperience",
  },
  {
    title: "AI with purpose.", emphasis: "Possibility, applied.",
    detail: "Whirlwind coordinates coding agents, verification, and human approvals, with durable state in SQLite.",
    proof: "Explore Whirlwind", href: "/projects?id=whirlwind",
  },
];

export default function CinematicStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)");
    let request = 0;
    let dispose: (() => void) | undefined;
    const sync = () => {
      const current = ++request;
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      import("./CinematicMotion").then(({ mountCinematicMotion }) => {
        if (current !== request || !media.matches) return;
        dispose = mountCinematicMotion(story);
        window.dispatchEvent(new Event("portfolio-layout-ready"));
      }).catch(() => { /* Static chapters remain readable if enhancement fails. */ });
    };
    sync();
    media.addEventListener("change", sync);
    return () => { request++; media.removeEventListener("change", sync); dispose?.(); };
  }, []);

  return (
    <div ref={storyRef} className={styles.story} data-navigation-story>
      <div className={styles.frame}>
        <section className={styles.hero} id="max-jumbo" aria-labelledby="hero-heading" data-navigation-tone="light" data-story-intro>
          <div className={styles.heroCopy}>
            <h1 id="hero-heading">Nirmal <span>Khedkar<span className={styles.period}>.</span></span></h1>
            <p className={styles.positioning}>Backend &amp; infrastructure engineer.</p>
            <p className={styles.proof}>Visa · ZOLL Data Systems · NITK Surathkal · MS CS, CU Boulder</p>
            <div className={styles.actions}>
              <Link data-analytics-skip-global="true" className={styles.primaryAction} href="#workexperience"
                onClick={() => trackSelectContent("hero_cta", "View work", { destination: "#workexperience" })}>View work</Link>
              <Link data-analytics-skip-global="true" href="/resume" onClick={() => trackResumeOpen("hero_cta")}>Résumé</Link>
              <Link data-analytics-skip-global="true" href="#contact" onClick={() => trackSelectContent("lead_cta", "want_to_hire")}>Contact</Link>
            </div>
          </div>
          <figure className={styles.portrait}>
            <Image src={beachPhoto} alt="Nirmal Khedkar on the California coast" fill priority sizes="(max-width: 767px) 100vw, 44vw" className={styles.heroImage} />
            <figcaption>California coast.</figcaption>
          </figure>
          <p className={styles.scrollHint}>A closer look at how I build.
            <svg width="20" height="32" viewBox="0 0 20 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M10 2v26m-6-6 6 6 6-6" /></svg>
          </p>
        </section>

        <section className={styles.engineering} id="engineering" aria-labelledby="engineering-heading" data-story-engineering>
          <header className={styles.engineeringHeader}>
            <h2 id="engineering-heading">Built for the real world.</h2>
          </header>
          <div className={styles.systemMap} aria-hidden="true">
            <svg viewBox="0 0 640 500" fill="none" focusable="false">
              <path className={styles.routeBase} d="M72 360V220H220V120H390V300H550" />
              <path className={styles.routeActive} pathLength="1" d="M72 360V220H220V120H390V300H550" />
              {[[72, 360], [220, 220], [390, 120], [550, 300]].map(([cx, cy], index) => (
                <g className={styles.mapNode} data-map-node={index} key={index}>
                  <circle cx={cx} cy={cy} r="12" />
                  <text x={cx} y={cy + 45} textAnchor="middle">{["Product", "Infrastructure", "Security", "AI"][index]}</text>
                </g>
              ))}
            </svg>
          </div>
          <ol className={styles.stages} aria-label="Engineering disciplines">
            {chapters.map((chapter) => (
              <li className={styles.stage} data-story-stage key={chapter.title}>
                <h3>{chapter.title}<span>{chapter.emphasis}</span></h3>
                <p>{chapter.detail}</p>
                <Link href={chapter.href} className={styles.stageProof}>{chapter.proof}</Link>
              </li>
            ))}
          </ol>
          <div className={styles.engineeringFoot}>
            <span>Product. Infrastructure. Security. AI.</span>
            <Link href="#workexperience">Continue to experience</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
