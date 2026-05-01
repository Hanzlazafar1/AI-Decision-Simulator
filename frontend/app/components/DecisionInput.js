"use client";

import { useState } from "react";
import styles from "./DecisionInput.module.css";

const SUGGESTED_PRIORITIES = [
  "career growth",
  "salary",
  "job satisfaction",
  "work-life balance",
  "financial security",
  "learning",
  "networking",
  "stability",
  "creativity",
  "impact",
  "flexibility",
  "speed",
];

export default function DecisionInput({
  question,
  setQuestion,
  context,
  setContext,
  priorities,
  setPriorities,
  onAnalyze,
  loading,
  error,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPriority, setCustomPriority] = useState("");

  const togglePriority = (p) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const addCustomPriority = () => {
    if (customPriority.trim() && !priorities.includes(customPriority.trim())) {
      setPriorities((prev) => [...prev, customPriority.trim()]);
      setCustomPriority("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className={styles.wrapper} id="decision-input">
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#inputGrad)" opacity="0.3"/>
              <path d="M2 17l10 5 10-5" stroke="url(#inputGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="url(#inputGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="inputGrad" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#22d3ee"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h2 className={styles.cardTitle}>Decision Simulator</h2>
            <p className={styles.cardSubtitle}>Describe your decision and let AI analyze the outcomes</p>
          </div>
        </div>

        {/* Main Question */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>💭</span>
            Your Decision Question
          </label>
          <textarea
            className={styles.textarea}
            placeholder="e.g., Should I learn React or AI/Machine Learning?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            id="question-input"
          />
          <div className={styles.charCount}>{question.length}/1000</div>
        </div>

        {/* Advanced Toggle */}
        <button
          className={styles.advancedToggle}
          onClick={() => setShowAdvanced(!showAdvanced)}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`${styles.toggleIcon} ${showAdvanced ? styles.open : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Advanced Options</span>
          <span className={styles.optional}>(optional)</span>
        </button>

        {/* Advanced Section */}
        {showAdvanced && (
          <div className={styles.advanced}>
            {/* Context */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>📋</span>
                Your Context
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Describe your current situation, experience, constraints..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                id="context-input"
              />
            </div>

            {/* Priorities */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>🎯</span>
                Your Priorities
              </label>
              <div className={styles.priorityGrid}>
                {SUGGESTED_PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.priorityChip} ${
                      priorities.includes(p) ? styles.priorityActive : ""
                    }`}
                    onClick={() => togglePriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className={styles.customPriority}>
                <input
                  type="text"
                  className={styles.priorityInput}
                  placeholder="Add custom priority..."
                  value={customPriority}
                  onChange={(e) => setCustomPriority(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomPriority()}
                />
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={addCustomPriority}
                  disabled={!customPriority.trim()}
                >
                  +
                </button>
              </div>
              {priorities.length > 0 && (
                <div className={styles.selectedPriorities}>
                  <span className={styles.selectedLabel}>Selected:</span>
                  {priorities.map((p) => (
                    <span key={p} className={styles.selectedChip}>
                      {p}
                      <button type="button" onClick={() => togglePriority(p)} className={styles.removeChip}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          className={styles.submit}
          onClick={() => onAnalyze()}
          disabled={loading || !question.trim()}
          id="analyze-button"
        >
          {loading ? (
            <>
              <div className={styles.spinner}></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Analyze Decision
            </>
          )}
        </button>

        {/* Pipeline info */}
        <div className={styles.pipeline}>
          <div className={styles.pipelineStep}>
            <div className={styles.stepDot}></div>
            <span>Extract Options</span>
          </div>
          <div className={styles.pipelineLine}></div>
          <div className={styles.pipelineStep}>
            <div className={styles.stepDot}></div>
            <span>Deep Analysis</span>
          </div>
          <div className={styles.pipelineLine}></div>
          <div className={styles.pipelineStep}>
            <div className={styles.stepDot}></div>
            <span>Alternatives</span>
          </div>
          <div className={styles.pipelineLine}></div>
          <div className={styles.pipelineStep}>
            <div className={styles.stepDot}></div>
            <span>Synthesis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
