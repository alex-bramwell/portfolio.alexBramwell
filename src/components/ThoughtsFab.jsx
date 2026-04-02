import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import "./ThoughtsFab.scss";

const ARTICLES = [
  { id: "design-to-production-pipeline", title: "The design-to-production pipeline" },
  { id: "outcome-oriented-design", title: "Outcome-oriented design" },
  { id: "spec-driven-development", title: "Spec-driven development" },
  { id: "the-split-brain-problem", title: "The split-brain problem" },
  { id: "javascript-to-react", title: "JavaScript to React" },
  { id: "react-concepts", title: "React basics explained" },
  { id: "scss-in-practice", title: "SCSS made simple" },
  { id: "web-accessibility", title: "Web accessibility basics" },
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
        <svg className="thoughts-fab-icon" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      </button>
    </>
  );
}
