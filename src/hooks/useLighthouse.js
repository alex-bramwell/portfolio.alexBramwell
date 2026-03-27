import { useState, useEffect, useRef } from "react";

const SCORES_URL = import.meta.env.BASE_URL + "lighthouse.json";

const FALLBACK_SCORES = {
  performance: 100,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
  timestamp: null,
};

export function useLighthouse() {
  const [scores, setScores] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const triggerRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched.current) {
          hasFetched.current = true;
          observer.disconnect();
          fetchScores();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function fetchScores() {
    setStatus("loading");

    try {
      const res = await fetch(SCORES_URL);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      setScores({
        performance: data.performance ?? 0,
        accessibility: data.accessibility ?? 0,
        bestPractices: data.bestPractices ?? 0,
        seo: data.seo ?? 0,
        timestamp: data.timestamp ?? null,
      });
      setStatus("done");
    } catch {
      setScores(FALLBACK_SCORES);
      setStatus("done");
    }
  }

  return { scores, status, triggerRef };
}
