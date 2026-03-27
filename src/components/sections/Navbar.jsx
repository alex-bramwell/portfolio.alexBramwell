import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import ThemeToggle from "../ThemeToggle";
import MotionToggle from "../MotionToggle";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.scss";

export default function Navbar({ isScrolled, onOpenContact }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef(null);
  const moreRef = useRef(null);
  const settingsRef = useRef(null);
  const tlRef = useRef(null);
  const { isReduced } = useTheme();

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    document.body.style.overflow = "hidden";

    if (isReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    tl.fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.45 })
      .fromTo(".mobile-nav-link", { opacity: 0, y: 24, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.35, stagger: 0.06 }, "-=0.2")
      .fromTo(".mobile-nav-footer", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.15");
  }, [isReduced]);

  const closeMenu = useCallback(() => {
    if (isReduced) {
      setIsMenuOpen(false);
      document.body.style.overflow = "";
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuOpen(false);
        document.body.style.overflow = "";
      },
    });
    tl.to(".mobile-nav-link, .mobile-nav-footer", { opacity: 0, y: -12, duration: 0.2, stagger: 0.03 })
      .to(menuRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.3, ease: "power3.in" }, "-=0.1");
  }, [isReduced]);

  const handleLinkClick = useCallback(() => {
    if (isMenuOpen) closeMenu();
  }, [isMenuOpen, closeMenu]);

  const handleContactClick = useCallback(() => {
    if (isMenuOpen) closeMenu();
    onOpenContact();
  }, [isMenuOpen, closeMenu, onOpenContact]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (isMenuOpen) closeMenu();
        setIsMoreOpen(false);
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMenuOpen, closeMenu]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setIsMoreOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setIsSettingsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`top-navigation ${isScrolled ? "navigation-scrolled" : ""}`}>
        <div className="nav-logo-mark">Alex<span>.</span></div>

        {/* Desktop nav */}
        <ul className="nav-link-list">
          <li className="nav-link-item"><a href="#about">About</a></li>
          <li className="nav-link-item"><a href="#projects">Work</a></li>
          <li className="nav-link-item"><a href="#design-system">Design System</a></li>
          <li className="nav-link-item"><a href="#experience">Experience</a></li>

          {/* More dropdown */}
          <li className="nav-link-item nav-dropdown-wrapper" ref={moreRef}>
            <button
              className={`nav-dropdown-trigger ${isMoreOpen ? "nav-dropdown-active" : ""}`}
              onClick={() => { setIsMoreOpen((v) => !v); setIsSettingsOpen(false); }}
            >
              More
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 4 5 6.5 7.5 4" />
              </svg>
            </button>
            {isMoreOpen && (
              <div className="nav-dropdown-menu">
                <a href="#skills" className="nav-dropdown-item" onClick={() => setIsMoreOpen(false)}>Skills</a>
                <a href="#thinking" className="nav-dropdown-item" onClick={() => setIsMoreOpen(false)}>Thinking</a>
              </div>
            )}
          </li>

          {/* Settings popover */}
          <li className="nav-link-item nav-dropdown-wrapper" ref={settingsRef}>
            <button
              className={`nav-settings-trigger ${isSettingsOpen ? "nav-dropdown-active" : ""}`}
              onClick={() => { setIsSettingsOpen((v) => !v); setIsMoreOpen(false); }}
              aria-label="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            {isSettingsOpen && (
              <div className="nav-dropdown-menu nav-settings-menu">
                <div className="nav-settings-row">
                  <span className="nav-settings-label">Theme</span>
                  <ThemeToggle compact />
                </div>
                <div className="nav-settings-row">
                  <span className="nav-settings-label">Motion</span>
                  <MotionToggle compact />
                </div>
              </div>
            )}
          </li>

          <li className="nav-link-item">
            <button className="nav-contact-button" onClick={onOpenContact}>Get in touch</button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`hamburger-button ${isMenuOpen ? "hamburger-open" : ""}`}
          onClick={isMenuOpen ? closeMenu : openMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line hamburger-line-1" />
          <span className="hamburger-line hamburger-line-2" />
          <span className="hamburger-line hamburger-line-3" />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-nav-overlay ${isMenuOpen ? "mobile-nav-visible" : ""}`}
        ref={menuRef}
        style={isReduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="mobile-nav-inner" style={isReduced ? undefined : { perspective: "600px" }}>
          <a href="#about" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">01</span>
            <span className="mobile-nav-link-text">About</span>
          </a>
          <a href="#skills" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">02</span>
            <span className="mobile-nav-link-text">Skills</span>
          </a>
          <a href="#projects" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">03</span>
            <span className="mobile-nav-link-text">Work</span>
          </a>
          <a href="#design-system" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">04</span>
            <span className="mobile-nav-link-text">Design System</span>
          </a>
          <a href="#thinking" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">05</span>
            <span className="mobile-nav-link-text">Thinking</span>
          </a>
          <a href="#experience" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">06</span>
            <span className="mobile-nav-link-text">Experience</span>
          </a>
          <a href="#contact" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">07</span>
            <span className="mobile-nav-link-text">Contact</span>
          </a>
          <div className="mobile-nav-footer">
            <MotionToggle />
            <ThemeToggle />
            <button className="nav-contact-button" onClick={handleContactClick}>Get in touch</button>
          </div>
        </div>
      </div>
    </>
  );
}
