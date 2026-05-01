"use client";

import { useState } from "react";
import styles from "./AnalysisResults.module.css";

function RiskBadge({ level }) {
  const config = {
    low: { label: "Low Risk", className: styles.riskLow },
    medium: { label: "Medium Risk", className: styles.riskMedium },
    high: { label: "High Risk", className: styles.riskHigh },
  };
  const c = config[level] || config.medium;
  return <span className={`${styles.riskBadge} ${c.className}`}>{c.label}</span>;
}

function ScoreRing({ score, size = 72 }) {
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f43f5e";
  return (
    <div className={styles.scoreRing} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dashoffset 1s ease-out"}}/>
      </svg>
      <span className={styles.scoreValue} style={{color}}>{score}</span>
    </div>
  );
}

export default function AnalysisResults({ results, onReset }) {
  const [expandedOption, setExpandedOption] = useState(null);
  if (!results) return null;

  return (
    <div className={styles.results}>
      {/* Hero Recommendation */}
      <section className={styles.heroCard}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}><span>🏆</span> AI Recommendation</div>
          <h2 className={styles.heroTitle}>{results.best_choice}</h2>
          <p className={styles.heroReasoning}>{results.best_choice_reasoning}</p>
          <div className={styles.heroMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Confidence</span>
              <div className={styles.confidenceBar}>
                <div className={styles.confidenceFill} style={{width:`${results.confidence}%`}}></div>
              </div>
              <span className={styles.metaValue}>{results.confidence}%</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Overall Risk</span>
              <RiskBadge level={results.overall_risk}/>
            </div>
          </div>
        </div>
      </section>

      {/* Key Factors */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><span className={styles.sectionIcon}>🎯</span>Key Decision Factors</h3>
        <div className={styles.factorsGrid}>
          {results.key_factors?.map((f,i)=>(
            <div key={i} className={styles.factorCard} style={{animationDelay:`${i*0.1}s`}}>
              <div className={styles.factorNumber}>{i+1}</div><span>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Option Cards */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><span className={styles.sectionIcon}>📊</span>Detailed Option Analysis</h3>
        <div className={styles.optionsGrid}>
          {results.options?.map((option,i)=>{
            const isExp = expandedOption===i;
            const isBest = option.name===results.best_choice;
            return (
              <div key={i} className={`${styles.optionCard} ${isBest?styles.bestOption:""}`}>
                {isBest && <div className={styles.bestLabel}><span>⭐</span> Best Choice</div>}
                <div className={styles.optionHeader}>
                  <div className={styles.optionInfo}>
                    <h4 className={styles.optionName}>{option.name}</h4>
                    <div className={styles.optionMeta}>
                      <RiskBadge level={option.risk_level}/>
                      <span className={styles.timeline}>⏱ {option.timeline}</span>
                    </div>
                  </div>
                  <ScoreRing score={option.score}/>
                </div>
                <p className={styles.expectedOutcome}>{option.expected_outcome}</p>
                <button className={styles.expandBtn} onClick={()=>setExpandedOption(isExp?null:i)}>
                  {isExp?"Hide Details":"Show Pros & Cons"}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={isExp?styles.rotated:""}>
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {isExp && (
                  <div className={styles.prosConsGrid}>
                    <div className={styles.prosCol}>
                      <h5 className={styles.prosTitle}><span>✅</span> Pros</h5>
                      <ul className={styles.prosList}>{option.pros?.map((p,j)=><li key={j}>{p}</li>)}</ul>
                    </div>
                    <div className={styles.consCol}>
                      <h5 className={styles.consTitle}><span>⚠️</span> Cons</h5>
                      <ul className={styles.consList}>{option.cons?.map((c,j)=><li key={j}>{c}</li>)}</ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Score Comparison */}
      {results.options?.length>1 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><span className={styles.sectionIcon}>📈</span>Score Comparison</h3>
          <div className={styles.chartCard}>
            {results.options.map((o,i)=>{
              const color = o.score>=70?"var(--accent-emerald)":o.score>=40?"var(--accent-amber)":"var(--accent-rose)";
              return (
                <div key={i} className={styles.chartRow}>
                  <span className={styles.chartLabel}>{o.name}</span>
                  <div className={styles.chartBarBg}>
                    <div className={styles.chartBar} style={{width:`${o.score}%`,background:color,animationDelay:`${i*0.2}s`}}></div>
                  </div>
                  <span className={styles.chartScore} style={{color}}>{o.score}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Alternatives */}
      {results.alternatives?.length>0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><span className={styles.sectionIcon}>💡</span>Alternative Scenarios</h3>
          <div className={styles.altGrid}>
            {results.alternatives.map((alt,i)=>(
              <div key={i} className={styles.altCard}>
                <h4 className={styles.altTitle}>{alt.title}</h4>
                <span className={`${styles.feasibility} ${styles["feasibility"+alt.feasibility]}`}>{alt.feasibility} feasibility</span>
                <p className={styles.altDesc}>{alt.description}</p>
                <div className={styles.altImpact}>
                  <span className={styles.impactLabel}>Impact:</span>
                  <span className={styles.impactValue}>{alt.potential_impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Summary */}
      <section className={styles.summaryCard}>
        <div className={styles.summaryIcon}>📋</div>
        <h3 className={styles.summaryTitle}>Recommendation Summary</h3>
        <p className={styles.summaryText}>{results.recommendation_summary}</p>
      </section>

      <div className={styles.actions}>
        <button className={styles.resetBtn} onClick={onReset} id="reset-button">🔄 New Decision</button>
      </div>
    </div>
  );
}
