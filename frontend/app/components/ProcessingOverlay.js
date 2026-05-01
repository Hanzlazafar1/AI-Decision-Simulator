"use client";

import styles from "./ProcessingOverlay.module.css";

const STEPS = [
  {
    title: "Extracting Options",
    description: "Identifying decision alternatives from your question...",
    icon: "🔍",
  },
  {
    title: "Deep Analysis",
    description: "Evaluating each option with multi-factor reasoning...",
    icon: "🧠",
  },
  {
    title: "Generating Alternatives",
    description: "Discovering creative paths you may not have considered...",
    icon: "💡",
  },
  {
    title: "Synthesizing Results",
    description: "Building your comprehensive decision report...",
    icon: "⚡",
  },
];

export default function ProcessingOverlay({ currentStep }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Animated brain */}
        <div className={styles.brainContainer}>
          <div className={styles.brainPulse}></div>
          <div className={styles.brainPulse2}></div>
          <div className={styles.brainIcon}>🧠</div>
        </div>

        <h2 className={styles.title}>AI is Analyzing Your Decision</h2>
        <p className={styles.subtitle}>
          Running a {STEPS.length}-step graph-based reasoning pipeline
        </p>

        {/* Pipeline steps */}
        <div className={styles.pipeline}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${
                i < currentStep ? styles.completed : ""
              } ${i === currentStep ? styles.active : ""}`}
            >
              <div className={styles.stepIndicator}>
                {i < currentStep ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : i === currentStep ? (
                  <div className={styles.stepSpinner}></div>
                ) : (
                  <span className={styles.stepNumber}>{i + 1}</span>
                )}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <span className={styles.stepTitle}>{step.title}</span>
                </div>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
