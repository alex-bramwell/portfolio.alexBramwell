import "../styles/_shared.scss";

export default {
  title: "Components/SkillChip",
  parameters: {
    docs: {
      description: {
        component:
          "Compact tags used across skill listings and tech stacks. Support default and highlighted variants with hover states.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    highlighted: { control: "boolean" },
  },
};

const SkillChip = ({ label, highlighted }) => (
  <span className={`skill-chip${highlighted ? "-highlighted" : ""}`}>{label}</span>
);

export const Default = {
  render: (args) => <SkillChip {...args} />,
  args: { label: "React 19", highlighted: false },
};

export const Highlighted = {
  render: (args) => <SkillChip {...args} />,
  args: { label: "TypeScript", highlighted: true },
};

export const ChipGroup = {
  render: () => (
    <div className="skill-chip-list">
      {["React 19", "TypeScript", "Figma", "SCSS", "Storybook", "Docker", "WCAG 2.1"].map((tag) => (
        <span key={tag} className="skill-chip">{tag}</span>
      ))}
    </div>
  ),
};

export const MixedGroup = {
  render: () => (
    <div className="skill-chip-list">
      <span className="skill-chip-highlighted">React 19</span>
      <span className="skill-chip-highlighted">TypeScript</span>
      <span className="skill-chip">Figma</span>
      <span className="skill-chip">SCSS</span>
      <span className="skill-chip-highlighted">GSAP</span>
      <span className="skill-chip">Docker</span>
    </div>
  ),
};
