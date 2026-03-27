import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import "./ThoughtsFab.scss";

const ARTICLES = [
  { id: "design-to-production-pipeline", title: "The design-to-production pipeline" },
  { id: "outcome-oriented-design", title: "Outcome-oriented design" },
  { id: "spec-driven-development", title: "Spec-driven development" },
  { id: "the-split-brain-problem", title: "The split-brain problem" },
];

export default function ThoughtsFab({ onOpenArticle }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const fabRef = useRef(null);
  const { isReduced } = useTheme();

  // Subtle float animation on the FAB
  useEffect(() => {
    if (isReduced || !fabRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(fabRef.current, {
        y: -6, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, [isReduced]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          fabRef.current && !fabRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleArticleClick = (id) => {
    setIsOpen(false);
    onOpenArticle(id);
  };

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div className="thoughts-panel" ref={panelRef}>
          <div className="thoughts-panel-header">
            <span className="thoughts-panel-title">My Thoughts</span>
            <span className="thoughts-panel-count">{ARTICLES.length}</span>
          </div>
          <div className="thoughts-panel-list">
            {ARTICLES.map((article, i) => (
              <button
                key={article.id}
                className="thoughts-panel-item"
                onClick={() => handleArticleClick(article.id)}
              >
                <span className="thoughts-panel-number">{String(i + 1).padStart(2, "0")}</span>
                <span className="thoughts-panel-item-title">{article.title}</span>
                <span className="thoughts-panel-arrow">&rarr;</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        ref={fabRef}
        className={`thoughts-fab ${isOpen ? "thoughts-fab-active" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open articles menu"
      >
        <svg className="thoughts-fab-brain" viewBox="0 0 100 100" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
          {/* Dark outline behind everything */}
          <path d="M50 88c-2 0-3-1-4-3l-2-4c-2-2-4-3-6-4-5-2-9-5-12-9-4-5-6-11-5-17 0-3 1-6 3-8-2-3-2-7-1-10 2-4 5-7 9-8 1-1 3-2 5-2 2-4 5-7 9-8 3-1 5 0 5 0s2-1 5 0c4 1 7 4 9 8 2 0 4 1 5 2 4 1 7 4 9 8 1 3 1 7-1 10 2 2 3 5 3 8 1 6-1 12-5 17-3 4-7 7-12 9-2 1-4 2-6 4l-2 4c-1 2-2 3-4 3z" fill="var(--color-accent)" opacity="0.3" stroke="var(--color-accent)" strokeWidth="2" />
          {/* Main brain fill */}
          <path d="M50 84c-1.5 0-2.5-1-3.5-2.5l-2-3.5c-2-2.5-4.5-3.5-7-4.5-4.5-2-8-4.5-11-8.5-3.5-4.5-5-9.5-4.5-15 .2-3 1.2-5.5 3-7.5-1.5-2.5-2-6-.5-9 1.5-3.5 4.5-6 8-7 1-.5 2.5-1.5 4.5-1.5 2-3.5 5-6 8.5-7 2-.5 3.5-.2 4.5.2 1-.4 2.5-.7 4.5-.2 3.5 1 6.5 3.5 8.5 7 2 0 3.5 1 4.5 1.5 3.5 1 6.5 3.5 8 7 1.5 3 1 6.5-.5 9 1.8 2 2.8 4.5 3 7.5.5 5.5-1 10.5-4.5 15-3 4-6.5 6.5-11 8.5-2.5 1-5 2-7 4.5l-2 3.5c-1 1.5-2 2.5-3.5 2.5z" fill="var(--color-accent)" opacity="0.85" />
          {/* Left top lobe highlight */}
          <path d="M35 22c-3 1-5.5 3.5-6.5 6.5-.5 2 0 4 1 5.5 1-1 2-2.5 4-3.5 2.5-1.5 4-4 5.5-6.5.5-1 1-1.5 1.5-2-2-.5-3.5-.5-5.5 0z" fill="var(--color-accent)" opacity="0.6" />
          {/* Right top lobe highlight */}
          <path d="M65 22c3 1 5.5 3.5 6.5 6.5.5 2 0 4-1 5.5-1-1-2-2.5-4-3.5-2.5-1.5-4-4-5.5-6.5-.5-1-1-1.5-1.5-2 2-.5 3.5-.5 5.5 0z" fill="var(--color-accent)" opacity="0.6" />
          {/* Left lower lobe highlight */}
          <path d="M26 42c-2 1-3.5 3-3.5 5.5 0 3 1.5 6 4 8.5 2 2 4.5 3.5 7 4.5l1.5.8c-1.5-2-3.5-4-6-6.5-2.5-3-3.5-6-3-8.5.1-1.5.4-3 1-4.3z" fill="var(--color-accent)" opacity="0.55" />
          {/* Right lower lobe highlight */}
          <path d="M74 42c2 1 3.5 3 3.5 5.5 0 3-1.5 6-4 8.5-2 2-4.5 3.5-7 4.5l-1.5.8c1.5-2 3.5-4 6-6.5 2.5-3 3.5-6 3-8.5-.1-1.5-.4-3-1-4.3z" fill="var(--color-accent)" opacity="0.55" />
          {/* Central fissure */}
          <path d="M50 16C49 20 48 28 48.5 36c.3 5 1 10 1.5 14v18" stroke="var(--color-background)" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
          {/* Fold curves - left side */}
          <path d="M28 30c4 0 8-1 12-4" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
          <path d="M24 42c5-1 10-3 14-7" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" fill="none" />
          <path d="M28 54c4-1 8-4 12-8" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
          {/* Fold curves - right side */}
          <path d="M72 30c-4 0-8-1-12-4" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
          <path d="M76 42c-5-1-10-3-14-7" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" fill="none" />
          <path d="M72 54c-4-1-8-4-12-8" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
        </svg>
      </button>
    </>
  );
}
