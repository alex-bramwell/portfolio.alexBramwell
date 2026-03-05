import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import { CONTACT_DETAILS } from "../../data/content";
import "./Contact.scss";

export default function Contact() {
  return (
    <section className="page-section contact-section" id="contact">
      <div className="page-container">
        <div className="contact-two-column-grid">
          <ScrollReveal direction="left">
            <div>
              <div className="section-meta-row">
                <span className="section-number-label">05</span>
                <span className="section-eyebrow-label">Get in touch</span>
              </div>
              <SplitHeading className="section-main-heading">Let's build <br />something <br /><em>remarkable</em></SplitHeading>
              <p className="section-supporting-text">
                Actively looking for a Senior UI/UX + Frontend role where design systems and
                engineering intersect. Currently targeting permanent, remote-first or London hybrid positions.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <div className="contact-open-to-role-badge">
                <div className="contact-availability-dot" />
                Open to Senior UI/UX + Frontend roles
              </div>
              <div className="contact-details-list">
                {CONTACT_DETAILS.map((detail) =>
                  detail.href ? (
                    <a
                      key={detail.label}
                      href={detail.href}
                      className="contact-detail-row"
                      target={detail.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener"
                    >
                      <span className="contact-detail-field-label">{detail.label}</span>
                      <span className="contact-detail-field-value">{detail.value}</span>
                      <span className="contact-detail-row-arrow">&rarr;</span>
                    </a>
                  ) : (
                    <div key={detail.label} className="contact-detail-row" style={{ cursor: "default" }}>
                      <span className="contact-detail-field-label">{detail.label}</span>
                      <span className="contact-detail-field-value">{detail.value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
