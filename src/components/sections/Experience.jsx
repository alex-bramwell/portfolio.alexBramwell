import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import { EXPERIENCE_ITEMS } from "../../data/content";
import "./Experience.scss";

export default function Experience() {
  return (
    <section className="page-section" id="experience">
      <div className="page-container">
        <ScrollReveal>
          <div className="section-meta-row">
            <span className="section-number-label">05</span>
            <span className="section-eyebrow-label">Experience</span>
          </div>
          <SplitHeading className="section-main-heading">Where I've <em>shipped</em></SplitHeading>
        </ScrollReveal>
        <div className="experience-timeline-list">
          {EXPERIENCE_ITEMS.map((job, index) => (
            <ScrollReveal key={job.company} stagger={index + 1}>
              <div className="experience-timeline-item">
                <div className="experience-company-meta-column">
                  <div className="experience-company-name">{job.company}</div>
                  <div className="experience-job-title">{job.role}</div>
                  <div className="experience-date-range">{job.dateRange}</div>
                </div>
                <div className="experience-achievements-column">
                  <ul className="experience-achievement-list">
                    {job.achievements.map((achievement, i) => (
                      <li key={i} className="experience-achievement-item">
                        <span className="experience-achievement-bullet-marker">&rarr;</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
