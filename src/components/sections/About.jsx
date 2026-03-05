import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import "./About.scss";

export default function About() {
  return (
    <section className="page-section about-section" id="about">
      <div className="page-container">
        <div className="about-two-column-grid">
          <ScrollReveal direction="left">
            <div>
              <div className="section-meta-row">
                <span className="section-number-label">01</span>
                <span className="section-eyebrow-label">About</span>
              </div>
              <SplitHeading className="section-main-heading">Design <br /><em>meets</em> <br />engineering</SplitHeading>
              <p className="about-body-paragraph" style={{ marginTop: "24px" }}>
                I'm a UX Engineer with a <strong>BA in Graphic Design</strong> from the University of Lincoln
                and 7+ years shipping interfaces for SaaS platforms. I work across the full design-to-code
                pipeline — equally at home in Figma as in a React codebase.
              </p>
              <p className="about-body-paragraph">
                I've built token-based design systems, authored full wireframe specifications for
                enterprise clients, shipped <strong>Stripe-integrated booking flows</strong>, and maintained
                multi-tenant frontend architectures from day one to production.
              </p>
              <div className="about-attribute-pill-list">
                {["\ud83d\udccd Nottinghamshire, UK", "\ud83c\udf93 BA Graphic Design \u00b7 Lincoln", "\u267f WCAG 2.1 AA", "\ud83c\udfc3 CrossFit & Hyrox"].map((attr) => (
                  <div key={attr} className="about-attribute-pill">{attr}</div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="about-strength-card-list">
              {[
                { marker: "01", title: "Design Systems", description: "Token-based component libraries in Storybook.js \u2014 the single source of truth between design and engineering." },
                { marker: "02", title: "Mobile-first SaaS", description: "Responsive, accessible interfaces for multi-tenant platforms, from booking flows to complex admin dashboards." },
                { marker: "03", title: "Full pipeline ownership", description: "From Figma wireframes through to deployed React components \u2014 I own the whole design-to-production journey." },
                { marker: "04", title: "Accessibility-first", description: "Every interface targets WCAG 2.1 AA as a baseline \u2014 keyboard navigation, colour contrast, screen readers." },
              ].map((strength) => (
                <div key={strength.marker} className="about-strength-card">
                  <div className="about-strength-card-header">
                    <span className="about-strength-number-marker">{strength.marker}</span>
                    <span className="about-strength-title">{strength.title}</span>
                  </div>
                  <p className="about-strength-description">{strength.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
