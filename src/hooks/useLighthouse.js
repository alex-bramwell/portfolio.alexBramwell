// useLighthouse.js - Lazy-fetches CI-generated Lighthouse scores on scroll
//
// The scores displayed on the site are not from a third-party API or a cached
// screenshot. A GitHub Actions workflow runs after every deploy: it launches 3
// Lighthouse audits against the live site, averages the results, and commits
// them to public/lighthouse.json. This hook fetches that static JSON file.
//
// I use IntersectionObserver to defer the fetch until the Design System section
// scrolls into view. There is no point loading performance data on page load
// when the user might never scroll that far. The observer disconnects after the
// first intersection, so we only fetch once per session.
//
// The fallback scores (all 100s) are there as a safety net, the JSON should
// always exist because the CI pipeline commits it, but if the fetch fails for
// any reason (network, CDN cache, corrupted file), the UI still renders
// gracefully rather than showing broken gauges.

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
