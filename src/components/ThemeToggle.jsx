import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.scss";

export default function ThemeToggle() {
  const { theme, toggleTheme, isReduced } = useTheme();
  const buttonRef = useRef(null);
  const isLight = theme === "light";

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn || isReduced) return;

    const sun = btn.querySelector(".theme-toggle-sun");
    const moon = btn.querySelector(".theme-toggle-moon");

    if (isLight) {
      gsap.to(sun, { scale: 1, rotate: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      gsap.to(moon, { scale: 0.5, rotate: -90, opacity: 0, duration: 0.3, ease: "power2.in" });
    } else {
      gsap.to(moon, { scale: 1, rotate: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      gsap.to(sun, { scale: 0.5, rotate: 90, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [isLight, isReduced]);

  return (
    <button
      ref={buttonRef}
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <span className="theme-toggle-icons">
        <svg className="theme-toggle-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg className="theme-toggle-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      <span className="theme-toggle-label">{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
