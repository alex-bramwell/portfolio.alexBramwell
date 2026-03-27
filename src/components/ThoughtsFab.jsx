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
        <svg className="thoughts-fab-brain" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Left hemisphere */}
          <path d="M16 4c-3 0-5.5 1-7 3-1.5 2-2 4.5-1.5 7 .3 1.5-.2 3-1.2 4-.8.8-1.3 2-1.3 3.2 0 2.5 2 4.8 5 4.8h1.5" />
          <path d="M10.5 11c-1 .5-1.8 1.5-1.8 3" />
          <path d="M12 8c-.8.5-1.5 1.5-1.5 2.5" />
          {/* Right hemisphere */}
          <path d="M16 4c3 0 5.5 1 7 3 1.5 2 2 4.5 1.5 7-.3 1.5.2 3 1.2 4 .8.8 1.3 2 1.3 3.2 0 2.5-2 4.8-5 4.8H20.5" />
          <path d="M21.5 11c1 .5 1.8 1.5 1.8 3" />
          <path d="M20 8c.8.5 1.5 1.5 1.5 2.5" />
          {/* Center line */}
          <line x1="16" y1="4" x2="16" y2="28" strokeDasharray="2 2" opacity="0.4" />
        </svg>
      </button>
    </>
  );
}
