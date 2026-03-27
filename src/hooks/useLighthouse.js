import { useState, useEffect, useRef } from "react";

const SITE_URL = "https://alex-bramwell.github.io/portfolio.alexBramwell/";
const CATEGORIES = ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"];
const CACHE_KEY = "lighthouse-scores";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Fallback scores shown when API is unreachable (e.g. local dev, rate limit)
const FALLBACK_SCORES = {
  performance: 100,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
};

function getCached() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { scores, timestamp, live } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return { scores, live };
  } catch {
    return null;
  }
}

function setCache(scores, live) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ scores, live, timestamp: Date.now() }));
  } catch {
    // sessionStorage unavailable
  }
}

export function useLighthouse() {
  const [scores, setScores] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [isLive, setIsLive] = useState(false);
  const triggerRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Check cache first
    const cached = getCached();
    if (cached) {
      setScores(cached.scores);
      setIsLive(cached.live);
      setStatus("done");
      return;
    }

    // Observe when the element scrolls into view
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

    const categoryParams = CATEGORIES.map((c) => `category=${c}`).join("&");
    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&${categoryParams}&strategy=desktop`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();

      const cats = data.lighthouseResult?.categories;
      if (!cats) throw new Error("No categories in response");

      const result = {
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
      };

      setScores(result);
      setIsLive(true);
      setStatus("done");
      setCache(result, true);
    } catch {
      // API failed: use fallback scores
      setScores(FALLBACK_SCORES);
      setIsLive(false);
      setStatus("done");
      setCache(FALLBACK_SCORES, false);
    }
  }

  return { scores, status, isLive, triggerRef };
}
