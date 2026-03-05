import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import { SKILL_CATEGORIES } from "../../data/content";
import "./Skills.scss";

export default function Skills() {
  return (
    <section className="page-section" id="skills">
      <div className="page-container">
        <ScrollReveal>
          <div className="section-meta-row">
            <span className="section-number-label">02</span>
            <span className="section-eyebrow-label">Skills & tools</span>
          </div>
          <SplitHeading className="section-main-heading">What I bring</SplitHeading>
        </ScrollReveal>
        <div className="skills-category-grid">
          {SKILL_CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.title} stagger={index + 1}>
              <div className="skill-category-card">
                <div className="skill-category-header">
                  <span className="skill-category-title">{category.title}</span>
                  <span className="skill-category-item-count">0{category.skills.length}</span>
                </div>
                <div className="skill-chip-list">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`skill-chip ${category.highlightedSkills.includes(skill) ? "skill-chip-highlighted" : ""}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
