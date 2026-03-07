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
                pipeline, equally at home in Figma as in a React codebase.
              </p>
              <p className="about-body-paragraph">
                I've built token-based design systems, authored full wireframe specifications for
                enterprise clients, shipped <strong>Stripe-integrated booking flows</strong>, and maintained
                multi-tenant frontend architectures from day one to production.
              </p>
              <div className="about-attribute-pill-list">
                {[
                  {
                    label: "Nottinghamshire, UK",
                    icon: (
                      <svg className="pill-icon pill-icon-pin" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path d="M10 18s-6-5.35-6-10a6 6 0 1 1 12 0c0 4.65-6 10-6 10z" />
                      </svg>
                    ),
                  },
                  {
                    label: "BA Graphic Design · Lincoln",
                    icon: (
                      <svg className="pill-icon pill-icon-grad" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3 1 7.5l9 4.5 9-4.5L10 3z" />
                        <path d="M15 9.75v4.5L10 17l-5-2.75v-4.5" />
                      </svg>
                    ),
                  },
                  {
                    label: "WCAG 2.1 AA",
                    icon: (
                      <svg className="pill-icon pill-icon-a11y" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="10" cy="5" r="2" />
                        <path d="M10 9v4" />
                        <path d="M6 10l4 1 4-1" />
                        <path d="M8 17l2-4 2 4" />
                      </svg>
                    ),
                  },
                  {
                    label: "CrossFit & Hyrox",
                    icon: (
                      <svg className="pill-icon pill-icon-run" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="4" r="2" />
                        <path d="M8 9l3-1 2 3-3 4" />
                        <path d="M6 14l2-2" />
                        <path d="M13 17l-1-3" />
                      </svg>
                    ),
                  },
                  {
                    label: "Snowboarding",
                    icon: (
                      <svg className="pill-icon pill-icon-snow" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="3.5" r="1.5" />
                        <path d="M8 7l3 2 2 4" />
                        <path d="M7 9l4 1" />
                        <path d="M3 16c2-1 4-1.5 7-2s5-.5 7 1" />
                      </svg>
                    ),
                  },
                ].map((attr) => (
                  <div key={attr.label} className="about-attribute-pill">
                    {attr.icon}
                    {attr.label}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="about-strength-card-list">
              {[
                { marker: "01", title: "Design Systems", description: "Token-based component libraries in Storybook.js, the single source of truth between design and engineering." },
                { marker: "02", title: "Mobile-first SaaS", description: "Responsive, accessible interfaces for multi-tenant platforms, from booking flows to complex admin dashboards." },
                { marker: "03", title: "Full pipeline ownership", description: "From Figma wireframes through to deployed React components. I own the whole design-to-production journey." },
                { marker: "04", title: "Accessibility-first", description: "Every interface targets WCAG 2.1 AA as a baseline: keyboard navigation, colour contrast, screen readers." },
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
