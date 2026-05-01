"use client";

import styles from "./ExampleCards.module.css";

const categoryColors = {
  career: { bg: "rgba(99, 102, 241, 0.08)", border: "rgba(99, 102, 241, 0.2)", text: "#818cf8" },
  finance: { bg: "rgba(251, 191, 36, 0.08)", border: "rgba(251, 191, 36, 0.2)", text: "#fbbf24" },
  education: { bg: "rgba(34, 211, 238, 0.08)", border: "rgba(34, 211, 238, 0.2)", text: "#22d3ee" },
  business: { bg: "rgba(236, 72, 153, 0.08)", border: "rgba(236, 72, 153, 0.2)", text: "#ec4899" },
  lifestyle: { bg: "rgba(52, 211, 153, 0.08)", border: "rgba(52, 211, 153, 0.2)", text: "#34d399" },
};

export default function ExampleCards({ examples, onClick }) {
  if (!examples || examples.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>✨</span>
          Try an Example
        </h2>
        <p className={styles.subtitle}>Click any card to pre-fill the simulator</p>
      </div>

      <div className={styles.grid}>
        {examples.map((example, i) => {
          const colors = categoryColors[example.category] || categoryColors.career;
          return (
            <button
              key={i}
              className={styles.card}
              onClick={() => onClick(example)}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
              id={`example-card-${i}`}
            >
              <div className={styles.cardIcon}>{example.icon}</div>
              <div className={styles.cardContent}>
                <span
                  className={styles.category}
                  style={{
                    background: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  {example.category}
                </span>
                <h3 className={styles.cardTitle}>{example.question}</h3>
                <p className={styles.cardContext}>{example.context}</p>
                <div className={styles.priorities}>
                  {example.priorities.map((p, j) => (
                    <span key={j} className={styles.priorityTag}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.arrow}>→</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
