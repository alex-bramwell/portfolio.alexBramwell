import ScrollReveal from "../ScrollReveal";
import SplitHeading from "../SplitHeading";
import "./Thinking.scss";

const ARTICLES = [
  {
    id: "design-to-production-pipeline",
    number: "01",
    title: "The design-to-production pipeline",
    subtitle: "How Figma, Storybook, and React share a single source of truth",
    tags: ["Design Systems", "Figma", "Storybook", "Workflow"],
    readTime: "5 min read",
    featured: true,
  },
  {
    id: "outcome-oriented-design",
    number: "02",
    title: "Outcome-oriented design",
    subtitle: "Why AI is shifting UX from pixels to purpose",
    tags: ["UX Strategy", "AI-assisted Design", "Measurement"],
    readTime: "6 min read",
  },
  {
    id: "spec-driven-development",
    number: "03",
    title: "Spec-driven development",
    subtitle: "Writing specifications that AI turns into code",
    tags: ["Engineering", "AI Workflow", "Specifications"],
    readTime: "7 min read",
  },
];

export default function Thinking({ onOpenArticle }) {
  const featured = ARTICLES.find((a) => a.featured);
  const rest = ARTICLES.filter((a) => !a.featured);

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

        {/* Featured article */}
        {featured && (
          <ScrollReveal>
            <button
              className="thinking-featured-card"
              onClick={() => onOpenArticle(featured.id)}
            >
              <div className="thinking-featured-accent" aria-hidden="true" />
              <div className="thinking-featured-content">
                <div className="thinking-featured-meta">
                  <span className="thinking-article-number">{featured.number}</span>
                  <span className="thinking-featured-badge">Featured</span>
                  <span className="thinking-article-read-time">{featured.readTime}</span>
                </div>
                <h3 className="thinking-featured-title">{featured.title}</h3>
                <p className="thinking-featured-subtitle">{featured.subtitle}</p>
                <div className="thinking-article-tags">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="skill-chip">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="thinking-article-arrow">&rarr;</span>
            </button>
          </ScrollReveal>
        )}

        {/* Article grid */}
        <div className="thinking-article-grid">
          {rest.map((article, i) => (
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
