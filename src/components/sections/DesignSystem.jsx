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
            Tokens, components &<br /><em>documentation</em>
          </SplitHeading>
          <p className="section-supporting-text">
            A themeable design system built with CSS custom properties, SCSS, and React.
            Every component is documented in Storybook with live controls and theme switching.
          </p>
        </ScrollReveal>

        <div className="ds-grid">
          <ScrollReveal direction="left">
            <div className="ds-token-panel">
              <h3 className="ds-panel-title">Colour Tokens</h3>
              <p className="ds-panel-subtitle">Runtime-switchable via CSS custom properties</p>
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
              <p className="ds-panel-subtitle">6 documented components with live playground</p>
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
              <MagneticButton
                href="/portfolio.alexBramwell/storybook/"
                className="button-filled ds-storybook-link"
                target="_blank"
              >
                Open Storybook &rarr;
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
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
