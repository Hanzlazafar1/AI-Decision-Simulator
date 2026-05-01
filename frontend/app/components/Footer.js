"use client";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>🧠 DecisionAI</span>
          <p className={styles.tagline}>Graph-based AI decision analysis</p>
        </div>
        <div className={styles.tech}>
          <span className={styles.techChip}>Next.js</span>
          <span className={styles.techChip}>FastAPI</span>
          <span className={styles.techChip}>LangGraph</span>
          <span className={styles.techChip}>Groq / OpenAI</span>
        </div>
        <p className={styles.copy}>© 2026 AI Decision Simulator. Built with ❤️ and AI.</p>
      </div>
    </footer>
  );
}
