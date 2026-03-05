import ThemeToggle from "../ThemeToggle";
import "./Navbar.scss";

export default function Navbar({ isScrolled, onOpenContact }) {
  return (
    <nav className={`top-navigation ${isScrolled ? "navigation-scrolled" : ""}`}>
      <div className="nav-logo-mark">Alex<span>.</span></div>
      <ul className="nav-link-list">
        <li className="nav-link-item"><a href="#about">About</a></li>
        <li className="nav-link-item"><a href="#skills">Skills</a></li>
        <li className="nav-link-item"><a href="#projects">Work</a></li>
        <li className="nav-link-item"><a href="#experience">Experience</a></li>
        <li className="nav-link-item"><ThemeToggle /></li>
        <li className="nav-link-item">
          <button className="nav-contact-button" onClick={onOpenContact}>Get in touch</button>
        </li>
      </ul>
    </nav>
  );
}
