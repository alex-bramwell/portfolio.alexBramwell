import { ThemeProvider } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Animated sun/moon toggle that switches between light and dark themes. Uses GSAP for smooth icon transitions and persists preference to localStorage.",
      },
    },
  },
};

export const Default = {};

export const WithLabel = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ThemeToggle />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-secondary)" }}>
          Toggle theme
        </span>
      </div>
    </ThemeProvider>
  ),
};
