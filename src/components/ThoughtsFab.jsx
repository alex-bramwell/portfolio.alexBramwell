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
        <svg className="thoughts-fab-brain" viewBox="0 0 64 64" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Brain outline / shadow */}
          <path d="M32 56c-1.5 0-3-1-4-2.5-2-3-3.5-5-6-7C18 43 14.5 40 12 36c-2-3.2-3-6.5-3-10 0-4 1.5-7.5 4-10C15.5 13 19 11 23 10.5c1.5-.2 3-.1 4.5.2 1-2 2.5-3.2 4.5-3.2s3.5 1.2 4.5 3.2c1.5-.3 3-.4 4.5-.2 4 .5 7.5 2.5 10 5.5 2.5 2.5 4 6 4 10 0 3.5-1 6.8-3 10-2.5 4-6 6.8-10 10.5-2.5 2-4 4-6 7-1 1.5-2.5 2.5-4 2.5z" fill="var(--color-background)" stroke="var(--color-background)" strokeWidth="2" />
          {/* Left hemisphere - back lobe */}
          <path d="M30 52c-2-3-4-5.5-7-8-3.5-3-7-6-9.5-9.5C11.5 31.5 11 28.5 11 26c0-3.5 1.2-6.5 3.5-8.5C16.5 15.5 20 14 24 14c2 0 3.8.4 5.5 1.2.3.1.5.3.5.6V52z" fill="var(--color-accent)" opacity="0.85" />
          {/* Right hemisphere - back lobe */}
          <path d="M34 52c2-3 4-5.5 7-8 3.5-3 7-6 9.5-9.5C52.5 31.5 53 28.5 53 26c0-3.5-1.2-6.5-3.5-8.5C47.5 15.5 44 14 40 14c-2 0-3.8.4-5.5 1.2-.3.1-.5.3-.5.6V52z" fill="var(--color-accent)" opacity="0.85" />
          {/* Left top lobe */}
          <path d="M30 15.8c-1.5-.8-3.2-1.2-5-1.2-2.5 0-4.8.8-6.5 2.2C16.8 18.5 16 21 16 24c0 1.5.3 3 .8 4.2.5-.5 1.2-1 2-1.2 2-1 3.5-3 5-5.5 1-1.5 2.5-3.5 4.5-4.5.8-.4 1.2-.8 1.7-1.2z" fill="var(--color-accent)" opacity="0.65" />
          {/* Right top lobe */}
          <path d="M34 15.8c1.5-.8 3.2-1.2 5-1.2 2.5 0 4.8.8 6.5 2.2C47.2 18.5 48 21 48 24c0 1.5-.3 3-.8 4.2-.5-.5-1.2-1-2-1.2-2-1-3.5-3-5-5.5-1-1.5-2.5-3.5-4.5-4.5-.8-.4-1.2-.8-1.7-1.2z" fill="var(--color-accent)" opacity="0.65" />
          {/* Left front bump */}
          <path d="M18 27c-1.5.5-2.8 1.5-3.5 3-.8 1.8-.5 3.5.5 5 1.5 2 3.5 3.5 5.5 5 1.5 1 3 2.5 4.2 4 .8 1 1.8 2 2.8 3v-8c-1.5-1-3-2.5-4.5-4-2-2-3.5-4-5-8z" fill="var(--color-accent)" opacity="0.5" />
          {/* Right front bump */}
          <path d="M46 27c1.5.5 2.8 1.5 3.5 3 .8 1.8.5 3.5-.5 5-1.5 2-3.5 3.5-5.5 5-1.5 1-3 2.5-4.2 4-.8 1-1.8 2-2.8 3v-8c1.5-1 3-2.5 4.5-4 2-2 3.5-4 5-8z" fill="var(--color-accent)" opacity="0.5" />
          {/* Central fissure */}
          <line x1="32" y1="10" x2="32" y2="54" stroke="var(--color-background)" strokeWidth="2.5" opacity="0.7" />
          {/* Fold lines - left */}
          <path d="M14 24c3-1 6-1.5 9-3.5" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M13 32c3.5-1.5 7-2 10-5" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
          <path d="M17 39c2.5-1 5-2.5 7-5" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          {/* Fold lines - right */}
          <path d="M50 24c-3-1-6-1.5-9-3.5" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M51 32c-3.5-1.5-7-2-10-5" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
          <path d="M47 39c-2.5-1-5-2.5-7-5" stroke="var(--color-background)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      </button>
    </>
  );
}
