"use client";

import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L2 8v12l12 6 12-6V8L14 2z"
                stroke="url(#logoGrad)"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="14" cy="14" r="4" fill="url(#logoGrad)" />
              <path d="M14 6v4M14 18v4M8 11l3.5 2M16.5 15l3.5 2M8 17l3.5-2M16.5 13l3.5-2" 
                stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>DecisionAI</span>
          <span className={styles.badge}>BETA</span>
        </div>

        <nav className={styles.nav}>
          <a href="#simulator" className={styles.navLink}>Simulator</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.navLink}>
            GitHub
          </a>
          <div className={styles.statusDot}>
            <span className={styles.dot}></span>
            <span className={styles.statusText}>AI Online</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
