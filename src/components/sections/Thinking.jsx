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
  {
    id: "the-split-brain-problem",
    number: "04",
    title: "The split-brain problem",
    subtitle: "What nobody tells you about being both the designer and the developer",
    tags: ["Career", "Design + Code", "Personal"],
    readTime: "5 min read",
  },
  {
    id: "javascript-to-react",
    number: "05",
    title: "JavaScript to React",
    subtitle: "Simple side-by-side examples showing how plain JS becomes React code",
    tags: ["JavaScript", "React", "Beginner"],
    readTime: "6 min read",
  },
  {
    id: "react-concepts",
    number: "06",
    title: "React basics explained",
    subtitle: "The most common React concepts with plain-English explanations and examples",
    tags: ["React", "Hooks", "Components"],
    readTime: "7 min read",
  },
  {
    id: "scss-in-practice",
    number: "07",
    title: "SCSS made simple",
    subtitle: "A beginner-friendly look at variables, nesting, and mixins with real examples",
    tags: ["SCSS", "CSS", "Styling"],
    readTime: "6 min read",
  },
  {
    id: "web-accessibility",
    number: "08",
    title: "Web accessibility basics",
    subtitle: "A practical guide to building websites that everyone can use",
    tags: ["Accessibility", "WCAG", "HTML"],
    readTime: "6 min read",
  },
  {
    id: "typescript-basics",
    number: "09",
    title: "TypeScript basics",
    subtitle: "A plain-English guide to TypeScript, with diagrams",
    tags: ["TypeScript", "JavaScript", "Beginner"],
    readTime: "8 min read",
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
            Articles on the tools, techniques, and ideas I work with daily.
            From AI-driven workflows to beginner-friendly guides on React, SCSS,
            and accessibility.
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
            <ScrollReveal key={article.id} direction={i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : "up"} stagger={i}>
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
