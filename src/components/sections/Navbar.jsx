import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import ThemeToggle from "../ThemeToggle";
import "./Navbar.scss";

export default function Navbar({ isScrolled, onOpenContact }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const tlRef = useRef(null);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    tl.fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.45 })
      .fromTo(".mobile-nav-link", { opacity: 0, y: 24, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.35, stagger: 0.06 }, "-=0.2")
      .fromTo(".mobile-nav-footer", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.15");
  }, []);

  const closeMenu = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuOpen(false);
        document.body.style.overflow = "";
      },
    });
    tl.to(".mobile-nav-link, .mobile-nav-footer", { opacity: 0, y: -12, duration: 0.2, stagger: 0.03 })
      .to(menuRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.3, ease: "power3.in" }, "-=0.1");
  }, []);

  const handleLinkClick = useCallback(() => {
    if (isMenuOpen) closeMenu();
  }, [isMenuOpen, closeMenu]);

  const handleContactClick = useCallback(() => {
    if (isMenuOpen) closeMenu();
    onOpenContact();
  }, [isMenuOpen, closeMenu, onOpenContact]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape" && isMenuOpen) closeMenu(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <nav className={`top-navigation ${isScrolled ? "navigation-scrolled" : ""}`}>
        <div className="nav-logo-mark">Alex<span>.</span></div>

        {/* Desktop nav */}
        <ul className="nav-link-list">
          <li className="nav-link-item"><a href="#about">About</a></li>
          <li className="nav-link-item"><a href="#skills">Skills</a></li>
          <li className="nav-link-item"><a href="#projects">Work</a></li>
          <li className="nav-link-item"><a href="#design-system">System</a></li>
          <li className="nav-link-item"><a href="#experience">Experience</a></li>
          <li className="nav-link-item"><ThemeToggle /></li>
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
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="mobile-nav-inner" style={{ perspective: "600px" }}>
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
            <span className="mobile-nav-link-text">System</span>
          </a>
          <a href="#experience" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">05</span>
            <span className="mobile-nav-link-text">Experience</span>
          </a>
          <a href="#contact" className="mobile-nav-link" onClick={handleLinkClick}>
            <span className="mobile-nav-link-number">06</span>
            <span className="mobile-nav-link-text">Contact</span>
          </a>
          <div className="mobile-nav-footer">
            <ThemeToggle />
            <button className="nav-contact-button" onClick={handleContactClick}>Get in touch</button>
          </div>
        </div>
      </div>
    </>
  );
}
