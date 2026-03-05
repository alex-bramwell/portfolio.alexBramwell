import MagneticButton from "./MagneticButton";
import "../styles/_shared.scss";

export default {
  title: "Components/MagneticButton",
  component: MagneticButton,
  parameters: {
    docs: {
      description: {
        component:
          "A button wrapper that follows the cursor with a magnetic pull effect using GSAP. Renders as an `<a>` when `href` is provided, otherwise a `<button>`.",
      },
    },
  },
  argTypes: {
    className: {
      control: "select",
      options: ["button-filled", "button-outlined"],
    },
    children: { control: "text" },
    href: { control: "text" },
  },
};

export const Filled = {
  args: {
    className: "button-filled",
    children: "View my work →",
  },
};

export const Outlined = {
  args: {
    className: "button-outlined",
    children: "Get in touch",
  },
};

export const AsLink = {
  args: {
    className: "button-filled",
    children: "Visit project →",
    href: "#",
  },
};

export const ButtonRow = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <MagneticButton className="button-filled">Primary action →</MagneticButton>
      <MagneticButton className="button-outlined">Secondary action</MagneticButton>
    </div>
  ),
};
