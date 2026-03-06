import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import MagneticButton from "../MagneticButton";
import "./DesignSystem.scss";

const TOKEN_GROUPS = [
  {
    label: "Surfaces",
    tokens: [
      { var: "--color-background", name: "Background" },
      { var: "--color-surface", name: "Surface" },
      { var: "--color-surface-raised", name: "Raised" },
    ],
  },
  {
    label: "Text",
    tokens: [
      { var: "--color-text-primary", name: "Primary" },
      { var: "--color-text-secondary", name: "Secondary" },
      { var: "--color-text-disabled", name: "Disabled" },
    ],
  },
  {
    label: "Accent",
    tokens: [
      { var: "--color-accent", name: "Accent" },
      { var: "--color-accent-dim", name: "Dim" },
      { var: "--color-accent-border", name: "Border" },
    ],
  },
  {
    label: "Borders",
    tokens: [
      { var: "--color-border", name: "Default" },
      { var: "--color-border-subtle", name: "Subtle" },
      { var: "--color-border-hover", name: "Hover" },
    ],
  },
];

const PIPELINE_STEPS = [
  {
    label: "Design Tokens",
    desc: "SCSS variables compile to CSS custom properties on :root. Toggle the theme on this page — every token swaps at runtime.",
    tech: "_variables.scss → var(--color-*)",
  },
  {
    label: "React Components",
    desc: "Every UI element on this page is a reusable React component consuming tokens directly. No hardcoded values anywhere.",
    tech: "JSX + SCSS modules",
  },
  {
    label: "Storybook",
    desc: "The same components on this page are documented in Storybook with interactive controls and theme toggle.",
    tech: "storybook build → /storybook",
  },
  {
    label: "CI / CD",
    desc: "Every push to main triggers GitHub Actions — Vite builds this site, Storybook builds alongside it, both deploy to Pages.",
    tech: "GitHub Actions → Pages",
  },
  {
    label: "Live Site",
    desc: "You're looking at it. This portfolio and its Storybook are served from the same domain — what you see is what's documented.",
    tech: "alex-bramwell.github.io",
  },
];

const COMPONENTS = [
  { name: "MagneticButton", desc: "GSAP cursor-follow interaction" },
  { name: "ThemeToggle", desc: "Animated sun/moon switcher" },
  { name: "ScrollReveal", desc: "Scroll-triggered entrance wrapper" },
  { name: "SplitHeading", desc: "Per-word 3D stagger animation" },
  { name: "SkillChip", desc: "Tag variants with hover states" },
  { name: "ContactModal", desc: "Form with 3D entrance + particles" },
];

export default function DesignSystem() {
  return (
    <section className="page-section design-system-section" id="design-system">
      <div className="page-container">
        <ScrollReveal>
          <div className="section-meta-row">
            <span className="section-number-label">04</span>
            <span className="section-eyebrow-label">Design System</span>
          </div>
          <SplitHeading className="section-main-heading">
            Built on a <em>system</em>
          </SplitHeading>
          <p className="section-supporting-text">
            This portfolio is powered by its own design system — themeable tokens, reusable
            React components, and a live Storybook. Every element on this page pulls from
            the same source of truth.
          </p>
        </ScrollReveal>

        <div className="ds-grid">
          <ScrollReveal direction="left">
            <div className="ds-token-panel">
              <h3 className="ds-panel-title">Colour Tokens</h3>
              <p className="ds-panel-subtitle">The tokens powering every colour on this page</p>
              <div className="ds-token-groups">
                {TOKEN_GROUPS.map((group) => (
                  <div key={group.label} className="ds-token-group">
                    <span className="ds-token-group-label">{group.label}</span>
                    <div className="ds-swatch-row">
                      {group.tokens.map((t) => (
                        <div key={t.var} className="ds-swatch">
                          <div className="ds-swatch-circle" style={{ background: `var(${t.var})` }} />
                          <span className="ds-swatch-name">{t.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="ds-component-panel">
              <h3 className="ds-panel-title">Component Library</h3>
              <p className="ds-panel-subtitle">The components that build this portfolio</p>
              <div className="ds-component-list">
                {COMPONENTS.map((c, i) => (
                  <div key={c.name} className="ds-component-row">
                    <span className="ds-component-index">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="ds-component-name">{c.name}</span>
                      <span className="ds-component-desc">{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="ds-pipeline">
            <h3 className="ds-pipeline-title">How this site is built and shipped</h3>
            <div className="ds-pipeline-steps">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.label} className="ds-pipeline-step">
                  <div className="ds-pipeline-step-header">
                    <span className="ds-pipeline-step-number">{String(i + 1).padStart(2, "0")}</span>
                    <span className="ds-pipeline-step-label">{step.label}</span>
                  </div>
                  <p className="ds-pipeline-step-desc">{step.desc}</p>
                  <span className="ds-pipeline-step-tech">{step.tech}</span>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="ds-pipeline-arrow" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2v10M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <a
            href="/portfolio.alexBramwell/storybook/"
            target="_blank"
            rel="noopener"
            className="ds-storybook-card"
          >
            <div className="ds-storybook-card-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="13" y2="11" />
              </svg>
            </div>
            <div className="ds-storybook-card-content">
              <h3 className="ds-storybook-card-title">Explore this site's Storybook</h3>
              <p className="ds-storybook-card-desc">
                Every component on this page is documented in a live Storybook — interactive
                controls, theme switching, and full token documentation. The same workflow
                I use to build and maintain design systems in production.
              </p>
            </div>
            <span className="ds-storybook-card-arrow">&rarr;</span>
          </a>

          <div className="ds-type-strip">
            <div className="ds-type-sample">
              <span className="ds-type-label">Display</span>
              <span className="ds-type-preview ds-type-display">Bricolage Grotesque</span>
            </div>
            <div className="ds-type-sample">
              <span className="ds-type-label">Body</span>
              <span className="ds-type-preview ds-type-body">Instrument Sans</span>
            </div>
            <div className="ds-type-sample">
              <span className="ds-type-label">Mono</span>
              <span className="ds-type-preview ds-type-mono">JetBrains Mono</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
