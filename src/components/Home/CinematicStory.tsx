import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trackSelectContent, trackResumeOpen } from "@/util/analytics";
import beachPhoto from "@/assets/images/BeachNK_1.jpg";
import styles from "./cinematicStory.module.scss";

export default function CinematicStory() {
  return (
    <section className={styles.hero} id="max-jumbo" aria-labelledby="hero-heading">
      <div className={styles.photograph} aria-hidden="true">
        <Image src={beachPhoto} alt="" fill priority sizes="100vw" className={styles.heroImage} />
      </div>
      <div className={styles.heroCopy}>
        <p className={styles.heroName}>Nirmal Khedkar</p>
        <h1 id="hero-heading">
          <span className={styles.displayName} aria-hidden="true">I BUILD &amp; SHIP BACKEND SYSTEMS.</span>
          <span className={styles.srOnly}>Nirmal Khedkar. I build and ship backend systems.</span>
        </h1>
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
            Résumé
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
      <p className={styles.photoCredit}>Nirmal Khedkar · California coast</p>
    </section>

  );
}
