import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useCountUp } from "../../hooks/useCountUp";
import { useTheme } from "../../context/ThemeContext";
import { ROLE_PHRASES } from "../../data/content";
import MagneticButton from "../MagneticButton";
import "./Hero.scss";

function AnimatedStat({ endValue, suffix, descriptor }) {
  const { display, triggerRef } = useCountUp(endValue, suffix);
  return (
    <div className="hero-stat-item" ref={triggerRef}>
      <div className="hero-stat-number">{display}</div>
      <div className="hero-stat-descriptor" style={{ whiteSpace: "pre-line" }}>{descriptor}</div>
    </div>
  );
}

export default function Hero({ onOpenArticle }) {
  const currentRoleText = useTypewriter(ROLE_PHRASES, 65, 2200);
  const sectionRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-availability-badge", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        delay: 0.3,
      })
        .from(
          ".hero-main-heading",
          { opacity: 0, y: 40, duration: 0.8 },
          "-=0.3"
        )
        .from(
          ".hero-role-typewriter-line",
          { opacity: 0, y: 20, duration: 0.5 },
          "-=0.4"
        )
        .from(
          ".hero-description-paragraph",
          { opacity: 0, y: 20, duration: 0.5 },
          "-=0.3"
        )
        .from(
          ".hero-seeking-line",
          { opacity: 0, y: 14, duration: 0.4 },
          "-=0.25"
        )
        .from(
          ".hero-action-button-row",
          { opacity: 0, y: 20, duration: 0.5 },
          "-=0.3"
        )
        .from(
          ".hero-featured-article",
          { opacity: 0, y: 14, duration: 0.4 },
          "-=0.2"
        )
        .from(
          ".hero-stats-row",
          { opacity: 0, x: 40, duration: 0.6 },
          "-=0.5"
        )
        .from(
          ".hero-code-snippet-block",
          { opacity: 0, x: 40, duration: 0.6 },
          "-=0.4"
        )
        .from(
          ".hero-tech-stack-tag-strip",
          { opacity: 0, x: 40, duration: 0.6 },
          "-=0.4"
        );

      // Subtle floating glow orbs
      gsap.to(".hero-glow-1", {
        x: 60, y: -40, scale: 1.15, opacity: 0.25,
        duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(".hero-glow-2", {
        x: -50, y: 50, scale: 0.9, opacity: 0.18,
        duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2,
      });
      gsap.to(".hero-glow-3", {
        x: 40, y: 30, scale: 1.1, opacity: 0.12,
        duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section className="hero-section" id="home" ref={sectionRef}>
      <div className="hero-glow-container" aria-hidden="true">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />
      </div>
      <div className="page-container">
        <div className="hero-two-column-grid">
          <div>
            <div className="hero-availability-badge">
              <div className="availability-status-dot" />
              Available for new opportunities
            </div>
            <h1 className="hero-main-heading">
              Alex
              <span className="hero-name-accent">Bramwell</span>
            </h1>
            <p className="hero-role-typewriter-line">
              <span className="hero-role-current-text">{currentRoleText}</span>
              <span className="typewriter-cursor" />
              {" "}&ndash; design&nbsp;{"\u2194\uFE0E"}&nbsp;code
            </p>
            <p className="hero-description-paragraph">
              7+ years designing and shipping production SaaS interfaces. I own the full pipeline,
              Figma wireframes through to deployed React components, with deep expertise in
              design systems, WCAG accessibility, and mobile-first UX.
            </p>
            <p className="hero-seeking-line">
              Looking for a UX Engineer or Design Systems role at a product company where design and engineering share the same table.
            </p>
            <div className="hero-action-button-row">
              <MagneticButton href="#projects" className="button-filled">View my work &rarr;</MagneticButton>
              <MagneticButton href="#contact" className="button-outlined">Get in touch</MagneticButton>
              <MagneticButton href="/portfolio.alexBramwell/alex-bramwell-cv.pdf" className="button-outlined" target="_blank" rel="noopener">Download CV &darr;</MagneticButton>
            </div>
            <button className="hero-featured-article" onClick={() => onOpenArticle("the-split-brain-problem")}>
              <span className="hero-featured-article-badge">New article</span>
              <span className="hero-featured-article-title">The split-brain problem</span>
              <span className="hero-featured-article-arrow">&rarr;</span>
            </button>
          </div>

          <div className="hero-right-panel">
            <div className="hero-stats-row">
              <AnimatedStat endValue={7} suffix="+" descriptor={"Years in\nproduct"} />
              <div className="hero-stat-item">
                <div className="hero-stat-number">Design {"\u2194\uFE0E"} Code</div>
                <div className="hero-stat-descriptor" style={{ whiteSpace: "pre-line" }}>{"Full\npipeline"}</div>
              </div>
              <AnimatedStat endValue={0} suffix="" descriptor={"Handoff\ngaps"} />
            </div>
            <div className="hero-code-snippet-block">
              <div><span className="code-keyword">const</span> <span className="code-property">engineer</span> = {"{"}</div>
              <div>  <span className="code-property">design</span>: <span className="code-string">"systems + UX"</span>,</div>
              <div>  <span className="code-property">stack</span>: <span className="code-string">"React · TS · SCSS"</span>,</div>
              <div>  <span className="code-property">a11y</span>: <span className="code-value">true</span>,</div>
              <div>  <span className="code-property">mobile</span>: <span className="code-string">"first"</span>,</div>
              <div>  <span className="code-property">tools</span>: [<span className="code-string">"Figma"</span>, <span className="code-string">"Storybook"</span>],</div>
              <div>{"}"}</div>
              <div style={{ marginTop: "6px" }} className="code-comment">{"// ready to ship →"}</div>
            </div>
            <div className="hero-tech-stack-tag-strip">
              {["React 19", "TypeScript", "Figma", "SCSS", "Storybook", "Supabase", "Docker", "WCAG 2.1"].map((tag) => (
                <span key={tag} className="skill-chip">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
