import ScrollReveal from "./ScrollReveal";
import "../styles/_shared.scss";

export default {
  title: "Components/ScrollReveal",
  component: ScrollReveal,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A wrapper that animates children into view when scrolled into the viewport using GSAP ScrollTrigger. Supports three directions: up, left, and right.",
      },
    },
  },
};

const DemoCard = ({ children }) => (
  <div
    style={{
      padding: "32px",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-medium)",
      background: "var(--color-surface)",
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-body)",
      maxWidth: "360px",
    }}
  >
    {children}
  </div>
);

export const FromBottom = {
  render: () => (
    <ScrollReveal direction="up">
      <DemoCard>This card reveals from below</DemoCard>
    </ScrollReveal>
  ),
};

export const FromLeft = {
  render: () => (
    <ScrollReveal direction="left">
      <DemoCard>This card reveals from the left</DemoCard>
    </ScrollReveal>
  ),
};

export const FromRight = {
  render: () => (
    <ScrollReveal direction="right">
      <DemoCard>This card reveals from the right</DemoCard>
    </ScrollReveal>
  ),
};

export const StaggeredGroup = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {[0, 1, 2, 3].map((i) => (
        <ScrollReveal key={i} direction="up" stagger={i}>
          <DemoCard>Card {i + 1}</DemoCard>
        </ScrollReveal>
      ))}
    </div>
  ),
};
