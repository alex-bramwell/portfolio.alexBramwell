import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function getInitialTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  return "light";
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
