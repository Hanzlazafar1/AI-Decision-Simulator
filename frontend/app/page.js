"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DecisionInput from "./components/DecisionInput";
import ExampleCards from "./components/ExampleCards";
import AnalysisResults from "./components/AnalysisResults";
import ProcessingOverlay from "./components/ProcessingOverlay";
import Footer from "./components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [priorities, setPriorities] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examples, setExamples] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/examples`);
      if (res.ok) {
        const data = await res.json();
        setExamples(data.examples || []);
      }
    } catch {
      // Use fallback examples if backend isn't running
      setExamples([
        {
          question: "Should I learn React or AI/Machine Learning?",
          context: "I'm a junior developer with 1 year of experience in Python",
          priorities: ["career growth", "salary", "job market demand"],
          category: "career",
          icon: "💻",
        },
        {
          question: "Should I invest in cryptocurrency or start freelancing?",
          context: "I have $5000 in savings and work a full-time job",
          priorities: ["financial security", "passive income", "risk management"],
          category: "finance",
          icon: "💰",
        },
        {
          question: "Should I pursue a Master's degree or gain work experience?",
          context: "I just graduated with a CS degree and have a job offer",
          priorities: ["long-term career", "learning", "networking"],
          category: "education",
          icon: "🎓",
        },
        {
          question: "Should I build a SaaS product or join a startup as a co-founder?",
          context: "I have a product idea and a friend offered me a CTO role",
          priorities: ["equity", "control", "speed to market"],
          category: "business",
          icon: "🚀",
        },
        {
          question: "Should I relocate to a tech hub or work remotely?",
          context: "I live in a small city with low cost of living",
          priorities: ["quality of life", "career opportunities", "cost of living"],
          category: "lifestyle",
          icon: "🌍",
        },
        {
          question: "Should I switch to a management role or stay technical?",
          context: "I'm a senior engineer with 8 years of experience",
          priorities: ["income growth", "job satisfaction", "impact"],
          category: "career",
          icon: "📊",
        },
      ]);
    }
  };

  const analyzeDecision = async (q, ctx, pri) => {
    const finalQ = q || question;
    const finalCtx = ctx || context;
    const finalPri = pri || priorities;

    if (!finalQ.trim()) {
      setError("Please enter a decision question.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setCurrentStep(0);

    // Simulate step progress
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          return 3;
        }
        return prev + 1;
      });
    }, 3000);

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: finalQ,
          context: finalCtx || null,
          priorities: finalPri.length > 0 ? finalPri : null,
        }),
      });

      clearInterval(stepInterval);
      setCurrentStep(4);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Analysis failed (${res.status})`);
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      clearInterval(stepInterval);
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure the FastAPI server is running on port 8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setQuestion(example.question);
    setContext(example.context);
    setPriorities(example.priorities);
    setResults(null);
    setError(null);
    // Scroll to input
    document.getElementById("decision-input")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setQuestion("");
    setContext("");
    setPriorities([]);
    setResults(null);
    setError(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={styles.main}>
      <Header />
      <Hero />

      <section className={styles.content}>
        <div className={styles.container}>
          <DecisionInput
            question={question}
            setQuestion={setQuestion}
            context={context}
            setContext={setContext}
            priorities={priorities}
            setPriorities={setPriorities}
            onAnalyze={analyzeDecision}
            loading={loading}
            error={error}
          />

          {!results && !loading && (
            <ExampleCards examples={examples} onClick={handleExampleClick} />
          )}

          {loading && <ProcessingOverlay currentStep={currentStep} />}

          {results && (
            <AnalysisResults results={results} onReset={handleReset} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
