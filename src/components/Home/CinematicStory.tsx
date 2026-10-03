import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackClick, trackSelectContent } from "@/util/analytics";
import beachPhoto from "@/assets/images/BeachNK_1.jpg";
import styles from "./cinematicStory.module.scss";

const stages = [
  {
    name: "Interface",
    work: "Visa Developer Platform",
    detail: "Built a frontend for querying product and client data, with GraphQL access to the same information.",
  },
  {
    name: "Services",
    work: "Visa · ZOLL Data Systems",
    detail: "Migrated Spring Boot services to Reactor at Visa. Built dispatch scheduling logic at ZOLL.",
  },
  {
    name: "Delivery",
    work: "Visa",
    detail: "Worked through tests, Jenkins pipelines, and deployment issues on the path to production.",
  },
  {
    name: "Infrastructure",
    work: "Personal homelab",
    detail: "Terraform provisions the machines; FluxCD keeps the cluster in sync with Git. Ansible is in progress.",
  },
];

export default function CinematicStory() {
  const storyRef = useRef<HTMLDivElement>(null);

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
        if (currentRequest === request && query.matches) dispose = mountCinematicMotion(story);
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
    <div className={styles.story} ref={storyRef}>
      <div className={styles.frame}>
        <section className={styles.hero} id="max-jumbo" aria-labelledby="hero-heading">
          <div className={styles.photograph} data-story-photo aria-hidden="true">
            <Image src={beachPhoto} alt="" fill priority sizes="100vw" className={styles.heroImage} />
          </div>
          <div className={styles.heroCopy} data-story-copy>
            <h1 id="hero-heading">
              <span className={styles.displayName} aria-hidden="true">NIRMAL.</span>
              <span className={styles.srOnly}>Nirmal Khedkar, backend and infrastructure engineer.</span>
            </h1>
            <p className={styles.positioning}>Backend &amp; infrastructure engineer.</p>
            <p className={styles.range}>From the interface to the infrastructure.</p>
            <p className={styles.proof}>Visa · ZOLL Data Systems · MS CS, CU Boulder</p>
            <div className={styles.actions}>
              <Link
                className={styles.primaryAction}
                href="#workexperience"
                onClick={() => {
                  trackSelectContent("hero_cta", "Latest Projects", { destination: "#workexperience" });
                  trackClick("Latest Projects", "jumbotron_cta");
                }}
              >
                View work
              </Link>
              <Link
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackSelectContent("resume", "home_resume_cta");
                  trackClick("download_resume", "engagement");
                }}
              >
                Resume <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="#contact"
                onClick={() => {
                  trackSelectContent("lead_cta", "want_to_hire");
                  trackClick("want_to_hire", "engagement");
                }}
              >
                Contact
              </Link>
            </div>
          </div>
          <p className={styles.photoCredit} data-story-credit>Nirmal Khedkar · California coast</p>
        </section>

        <section className={styles.engineering} aria-labelledby="engineering-heading" data-story-engineering>
          <header className={styles.engineeringHeader}>
            <h2 id="engineering-heading">Built end to end.</h2>
            <p>Four connected layers of work, from what people touch to what keeps it running.</p>
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
            {stages.map((stage, index) => (
              <li className={styles.stage} data-story-stage key={stage.name}>
                <span className={styles.stageIndex}>{String(index + 1).padStart(2, "0")} / 04</span>
                <h3>{stage.name}</h3>
                <p>{stage.detail}</p>
                <span className={styles.stageWork}>{stage.work}</span>
              </li>
            ))}
          </ol>
          <p className={styles.engineeringFoot}>Interface <span>→</span> Services <span>→</span> Delivery <span>→</span> Infrastructure</p>
        </section>
      </div>
    </div>
  );
}
