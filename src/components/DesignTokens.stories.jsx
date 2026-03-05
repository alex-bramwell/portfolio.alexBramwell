import "../styles/_shared.scss";

export default {
  title: "Foundation/Design Tokens",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The core design tokens powering the portfolio. All values are CSS custom properties that adapt to light and dark themes at runtime.",
      },
    },
  },
};

const Swatch = ({ token, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "var(--radius-small)",
        background: `var(${token})`,
        border: "1px solid var(--color-border)",
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-primary)" }}>
        {token}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text-disabled)" }}>
        {label}
      </div>
    </div>
  </div>
);

export const Colours = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "700px" }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)", marginBottom: "16px", fontSize: "16px" }}>
          Surfaces
        </h3>
        <Swatch token="--color-background" label="Page background" />
        <Swatch token="--color-surface" label="Card / section" />
        <Swatch token="--color-surface-raised" label="Hover / raised" />
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)", marginBottom: "16px", fontSize: "16px" }}>
          Borders
        </h3>
        <Swatch token="--color-border" label="Default border" />
        <Swatch token="--color-border-subtle" label="Subtle divider" />
        <Swatch token="--color-border-hover" label="Hover state" />
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)", marginBottom: "16px", fontSize: "16px" }}>
          Text
        </h3>
        <Swatch token="--color-text-primary" label="Headings / body" />
        <Swatch token="--color-text-secondary" label="Descriptions" />
        <Swatch token="--color-text-disabled" label="Subtle labels" />
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)", marginBottom: "16px", fontSize: "16px" }}>
          Accent
        </h3>
        <Swatch token="--color-accent" label="Primary accent" />
        <Swatch token="--color-accent-dim" label="Accent background" />
        <Swatch token="--color-accent-border" label="Accent border" />
        <Swatch token="--color-success" label="Success / status" />
      </div>
    </div>
  ),
};

export const Typography = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-accent)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px" }}>
          Display — Bricolage Grotesque
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 800, letterSpacing: "-2px", color: "var(--color-text-primary)", lineHeight: 1 }}>
          Design <span style={{ color: "var(--color-accent)" }}>Systems</span>
        </div>
      </div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-accent)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px" }}>
          Body — Instrument Sans
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: 1.75 }}>
          I own the full pipeline — Figma wireframes through to deployed React components — with deep expertise in design systems, accessibility, and mobile-first UX.
        </p>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-accent)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px" }}>
          Mono — JetBrains Mono
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
          const tokens = {"{"} radius: "4px | 8px", fonts: 3, themes: 2 {"}"};
        </div>
      </div>
    </div>
  ),
};

export const Spacing = {
  render: () => {
    const radii = [
      { token: "--radius-small", label: "4px — chips, buttons, badges" },
      { token: "--radius-medium", label: "8px — cards, panels, inputs" },
    ];
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)", marginBottom: "16px", fontSize: "16px" }}>
          Border Radius
        </h3>
        {radii.map((r) => (
          <div key={r.token} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div
              style={{
                width: "64px",
                height: "40px",
                background: "var(--color-accent-dim)",
                border: "1px solid var(--color-accent-border)",
                borderRadius: `var(${r.token})`,
              }}
            />
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-primary)" }}>
                {r.token}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text-disabled)" }}>
                {r.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
