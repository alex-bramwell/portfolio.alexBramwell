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
        <svg className="thoughts-fab-brain" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer brain shape - top-down view */}
          <path d="M16 3C10 3 5 7.5 5 13c0 3 1.2 5.5 3 7.5C10 23 12.5 25 14 27c.6.7 1.2 1.5 2 2 .8-.5 1.4-1.3 2-2 1.5-2 4-4 6-6.5 1.8-2 3-4.5 3-7.5 0-5.5-5-10-11-10z" />
          {/* Central fissure */}
          <path d="M16 5v22" strokeDasharray="2 1.5" opacity="0.5" />
          {/* Left hemisphere folds */}
          <path d="M14 7c-3 1-5 3.5-5.5 6.5" opacity="0.6" />
          <path d="M13 11c-2 .8-3.5 2.5-4 5" opacity="0.5" />
          <path d="M12 16c-1.5 1-2.5 2.5-3 4" opacity="0.4" />
          {/* Right hemisphere folds */}
          <path d="M18 7c3 1 5 3.5 5.5 6.5" opacity="0.6" />
          <path d="M19 11c2 .8 3.5 2.5 4 5" opacity="0.5" />
          <path d="M20 16c1.5 1 2.5 2.5 3 4" opacity="0.4" />
        </svg>
      </button>
    </>
  );
}
