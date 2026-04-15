import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import "./Projects.scss";

export default function Projects({ onOpenCaseStudy, onOpenArticle }) {
  return (
    <section className="page-section projects-section" id="projects">
      <div className="page-container">
        <ScrollReveal>
          <div className="section-meta-row">
            <span className="section-number-label">03</span>
            <span className="section-eyebrow-label">Selected work</span>
          </div>
          <SplitHeading className="section-main-heading">Projects <br />that <em>ship</em></SplitHeading>
        </ScrollReveal>
        <div className="project-card-layout-grid">
          <ScrollReveal direction="left">
            <div className="featured-project-card">
              <p className="featured-project-type-label">Featured · Open source · Full-stack SaaS</p>
              <h3 className="featured-project-name">NoSweat Fitness</h3>
              <p className="featured-project-description">
                Multi-tenant SaaS platform for gyms. Each gym gets a fully branded site with
                class booking, WOD programming, Stripe payments, coach profiles, and a member
                dashboard, designed and built end-to-end as a solo project.
              </p>
              <div className="project-tech-stack-tag-row">
                {["React 19", "TypeScript", "SCSS Modules", "Supabase", "Stripe", "Docker", "Vercel"].map((tech) => (
                  <span key={tech} className="skill-chip">{tech}</span>
                ))}
              </div>
              <div className="project-external-link-row">
                <a href="https://github.com/alex-bramwell/nosweat" className="project-external-link project-external-link-primary" target="_blank" rel="noopener">&uarr; GitHub repo</a>
                <a href="https://nosweat.fitness" className="project-external-link" target="_blank" rel="noopener">&rarr; Live demo</a>
                <a href="https://sketch.com/s/b2889da2-f9fb-42ca-aa6f-ebdb3948fafd/p/61B1B290-0763-4B00-A3AE-60D7AC99BC4E/canvas" className="project-external-link" target="_blank" rel="noopener">&rarr; View sketch</a>
              </div>
              <div className="featured-project-button-row">
                <button className="featured-project-case-study-button" onClick={onOpenCaseStudy}>
                  View full case study &darr;
                </button>
                <button className="featured-project-deep-dive-button" onClick={() => onOpenArticle("nosweat-fitness-deep-dive")}>
                  Read the deep dive &rarr;
                </button>
              </div>
            </div>
          </ScrollReveal>
          <div className="secondary-project-card-stack">
            <ScrollReveal direction="right" stagger={1}>
              <div className="secondary-project-card">
                <div className="secondary-project-icon-box">&#x25C8;</div>
                <div className="secondary-project-name">MailMetrics Design System</div>
                <p className="secondary-project-description">
                  Built and maintained the token-based Storybook component library powering the full
                  MailMetrics product suite. Established a single source of truth for colours, spacing,
                  and typography, cutting UI inconsistencies and onboarding time for new developers.
                  Full WCAG 2.1 AA compliance across every component.
                </p>
                <div className="skill-chip-list">
                  {["Storybook", "React", "SCSS", "TypeScript"].map((t) => (
                    <span key={t} className="skill-chip">{t}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" stagger={2}>
              <div className="secondary-project-card">
                <div className="secondary-project-icon-box">&#x2726;</div>
                <div className="secondary-project-name">ESB Networks · 18-Screen Spec</div>
                <p className="secondary-project-description">
                  Translated a complex requirements catalogue into an 18-screen wireframe specification
                  for ESB Networks' stock management system. Delivered responsive, WCAG-compliant UI
                  from initial discovery through to client-approved handoff, bridging stakeholder needs
                  and engineering constraints.
                </p>
                <div className="skill-chip-list">
                  {["Figma", "Balsamiq", "UX Spec", "WCAG 2.1"].map((t) => (
                    <span key={t} className="skill-chip">{t}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal>
          <div className="projects-experience-header">
            <span className="section-number-label">03.1</span>
            <span className="section-eyebrow-label">Work experience</span>
          </div>
        </ScrollReveal>
        <div className="projects-experience-list">
          {[
            {
              company: "MailMetrics",
              summary: "Most recently at MailMetrics as a UX Engineer on a currently seven-module enterprise SaaS platform for document management, composition, and data processing for large postal clients across Europe. I was designing across the whole product, writing production React, and maintaining a Storybook component library backed by a Figma design system. Genuinely sitting between design and engineering rather than just handing work over the fence.",
              tags: ["React", "TypeScript", "Storybook", "Figma", "Design Systems", "SCSS"],
            },
            {
              company: "Adare SEC",
              summary: "At Adare I was working on customer communications management tooling for enterprise clients, which is where I started getting deeper into the design-to-engineering handoff side of things.",
              tags: ["CCM Tooling", "Enterprise", "Design Handoff"],
            },
            {
              company: "Imosphere",
              summary: "At Imosphere I moved into UX on care management software. Very technical, regulated workflows, users who need clarity over anything else.",
              tags: ["UX Design", "Regulated Software", "Care Management"],
            },
            {
              company: "inspHire",
              summary: "At inspHire I was doing UI design on ERP software for the plant hire industry. Complex, workflow-heavy tracks for operations teams alongside developing the marketing website.",
              tags: ["UI Design", "ERP", "Marketing Site"],
            },
          ].map((job, index) => (
            <ScrollReveal key={job.company} stagger={index + 1}>
              <div className="projects-experience-item">
                <div className="projects-experience-company">{job.company}</div>
                <p className="projects-experience-summary">{job.summary}</p>
                <div className="skill-chip-list">
                  {job.tags.map((t) => (
                    <span key={t} className="skill-chip">{t}</span>
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
