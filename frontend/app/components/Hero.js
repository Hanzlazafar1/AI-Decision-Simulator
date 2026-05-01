"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const orbRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Animated background orbs */}
      <div className={styles.orbContainer} ref={orbRef}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        <div className={`${styles.orb} ${styles.orb3}`}></div>
      </div>

      {/* Floating neural nodes */}
      <div className={styles.nodes}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.node} style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.5}s`,
          }}></div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.pill}>
          <span className={styles.pillIcon}>🧠</span>
          <span>Powered by Graph-Based AI Reasoning</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>Simulate Your</span>
          <span className={styles.titleGradient}>Decisions</span>
          <span className={styles.titleLine}>Before You Make Them</span>
        </h1>

        <p className={styles.subtitle}>
          Ask any life or business question. Our AI analyzes options, predicts outcomes, 
          assesses risks, and reveals paths you haven&apos;t considered — all in seconds.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>4-Step</span>
            <span className={styles.statLabel}>Analysis Pipeline</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>LangGraph</span>
            <span className={styles.statLabel}>Reasoning Engine</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>Real-time</span>
            <span className={styles.statLabel}>AI Predictions</span>
          </div>
        </div>

        <a href="#decision-input" className={styles.cta}>
          <span>Start Simulating</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M10 16l-4-4M10 16l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
