import "./Footer.scss";

export default function Footer({ onOpenContact }) {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-cta-row">
          <p className="footer-cta-text">Like what you see?</p>
          <div className="footer-cta-actions">
            <button className="button-filled footer-cta-button" onClick={onOpenContact}>Get in touch &rarr;</button>
            <a href="mailto:alex.s.bramwell.86@gmail.com" className="button-outlined footer-cta-button">Email me</a>
          </div>
        </div>
        <div className="footer-inner-row">
          <span>&copy; {new Date().getFullYear()} ALEX BRAMWELL</span>
          <div className="footer-tech-stack-list">
            {["REACT 19", "JAVASCRIPT", "VITE", "SCSS"].map((item) => (
              <span key={item} className="footer-tech-stack-item">{item}</span>
            ))}
          </div>
          <span>NOTTINGHAMSHIRE &middot; UK</span>
        </div>
      </div>
    </footer>
  );
}
