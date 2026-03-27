import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import "./Thinking.scss";

const ARTICLES = [
  {
    id: "outcome-oriented-design",
    number: "01",
    title: "Outcome-oriented design",
    subtitle: "Why AI is shifting UX from pixels to purpose",
    tags: ["UX Strategy", "AI-assisted Design", "Measurement"],
    readTime: "6 min read",
  },
  {
    id: "spec-driven-development",
    number: "02",
    title: "Spec-driven development",
    subtitle: "Writing specifications that AI turns into code",
    tags: ["Engineering", "AI Workflow", "Specifications"],
    readTime: "7 min read",
  },
];

export default function Thinking({ onOpenArticle }) {
  return (
    <section className="page-section thinking-section" id="thinking">
      <div className="page-container">
        <ScrollReveal>
          <div className="section-meta-row">
            <span className="section-number-label">05</span>
            <span className="section-eyebrow-label">Thinking</span>
          </div>
          <SplitHeading className="section-main-heading">
            How I <em>think</em>
          </SplitHeading>
          <p className="section-supporting-text">
            Building products is not just about shipping features. These articles
            explore how AI is reshaping the way designers and engineers collaborate,
            and what it means for people who sit at that intersection.
          </p>
        </ScrollReveal>

        <div className="thinking-article-grid">
          {ARTICLES.map((article, i) => (
            <ScrollReveal key={article.id} direction={i === 0 ? "left" : "right"}>
              <button
                className="thinking-article-card"
                onClick={() => onOpenArticle(article.id)}
              >
                <div className="thinking-article-header">
                  <span className="thinking-article-number">{article.number}</span>
                  <span className="thinking-article-read-time">{article.readTime}</span>
                </div>
                <h3 className="thinking-article-title">{article.title}</h3>
                <p className="thinking-article-subtitle">{article.subtitle}</p>
                <div className="thinking-article-tags">
                  {article.tags.map((tag) => (
                    <span key={tag} className="skill-chip">{tag}</span>
                  ))}
                </div>
                <span className="thinking-article-arrow">&rarr;</span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
