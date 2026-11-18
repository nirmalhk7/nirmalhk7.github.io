import React from "react";
import styles from './portfolioHome.module.scss';

export default function WhirlwindWorkflow() {
  return (
    <figure className={styles.workflow}>
      <svg viewBox="0 0 400 454" role="img" aria-labelledby="workflow-title workflow-description">
        <title id="workflow-title">Whirlwind engineering workflow</title>
        <desc id="workflow-description">Human approvals precede isolated agent execution. Planning leads to execution, verification and review, then local delivery. SQLite preserves durable state throughout. Review can return work to execution.</desc>
        <defs>
          <marker id="workflow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 6 3 0 6" fill="currentColor" />
          </marker>
        </defs>
        <g className={styles.workflowLines} fill="none" stroke="currentColor" strokeWidth="1.25">
          <path d="M174 83v54m0 66v32m0 66v32" markerEnd="url(#workflow-arrow)" />
          <path d="M304 267h43V170h-43" markerEnd="url(#workflow-arrow)" />
          <path d="M42 71H20v345h285" strokeDasharray="3 5" />
          <path d="M20 170h22m-22 98h22m-22 98h22" strokeDasharray="3 5" />
        </g>
        <g className={styles.workflowBoxes}>
          <rect x="42" y="38" width="262" height="66" rx="4" />
          <rect x="42" y="137" width="262" height="66" rx="4" />
          <rect x="42" y="235" width="262" height="66" rx="4" />
          <rect x="42" y="333" width="262" height="66" rx="4" />
        </g>
        <g className={styles.workflowLabels} textAnchor="middle">
          <text x="173" y="79">Planning</text>
          <text x="173" y="178">Isolated execution</text>
          <text x="173" y="276">Verification / review</text>
          <text x="173" y="374">Local delivery</text>
        </g>
        <g className={styles.workflowAnnotations}>
          <circle cx="174" cy="120" r="4" />
          <text x="193" y="125">Human approvals</text>
          <text x="359" y="229" transform="rotate(-90 359 229)">iterate</text>
          <text x="42" y="439">SQLite · durable state</text>
        </g>
      </svg>
      <figcaption>Simplified workflow · Whirlwind</figcaption>
    </figure>
  );
}
