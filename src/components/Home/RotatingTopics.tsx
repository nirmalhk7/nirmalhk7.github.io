import React, { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import styles from "./portfolioHome.module.scss";

const topics = ["infrastructure", "products", "software engineering", "AI", "agents", "backend", "fullstack", "security"];

export default function RotatingTopics() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % topics.length), 2600);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <>
      <span className={styles.topicWindow} aria-hidden="true">
        <span className={styles.topicMeasure}>software engineering.</span>
        <AnimatePresence initial={false}>
          <m.span
            key={index}
            data-testid="rotating-topic"
            className={styles.topicWord}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {topics[reduceMotion ? 0 : index]}.
          </m.span>
        </AnimatePresence>
      </span>
      <span className={styles.topicAccessible}>{topics.join(", ")}.</span>
    </>
  );
}
