import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-inner-row">
          <span>&copy; 2025 ALEX BRAMWELL</span>
          <div className="footer-tech-stack-list">
            {["REACT 19", "TYPESCRIPT", "VITE", "SCSS"].map((item) => (
              <span key={item} className="footer-tech-stack-item">{item}</span>
            ))}
          </div>
          <span>NOTTINGHAMSHIRE &middot; UK</span>
        </div>
      </div>
    </footer>
  );
}
