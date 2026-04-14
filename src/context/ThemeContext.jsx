// ThemeContext.jsx - Theme (light/dark) and motion (full/reduced) provider
//
// I manage both theme and motion in a single context because they are both
// global visual preferences that every animated component needs access to.
// Splitting them into separate contexts would mean double the provider nesting
// and double the useContext calls in components like ScrollReveal and Hero.
//
// The key architectural decision: theme and motion are applied as data attributes
// on document.documentElement, not as React state passed through props. This means
// CSS can respond to theme changes without any re-render. The :root and
// [data-theme="light"] selectors in _base.scss swap every custom property at once.
// GSAP animations check isReduced from this context and return early if true,
// so the motion toggle is an architectural decision that touches every animation
// in the codebase, not a bolt-on feature.
//
// Motion defaults respect the OS-level prefers-reduced-motion media query on
// first visit, then persists the user's explicit choice to localStorage.

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function getInitialTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  return "dark";
}

function getInitialMotion() {
  const stored = localStorage.getItem("motion");
  if (stored) return stored;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  return "full";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [motion, setMotion] = useState(getInitialMotion);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", motion);
    localStorage.setItem("motion", motion);
  }, [motion]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleMotion = () => setMotion((m) => (m === "full" ? "reduced" : "full"));
  const isReduced = motion === "reduced";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, motion, toggleMotion, isReduced }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
