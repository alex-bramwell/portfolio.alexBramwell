import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useCountUp } from "../../hooks/useCountUp";
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

export default function Hero() {
  const currentRoleText = useTypewriter(ROLE_PHRASES, 65, 2200);
  const sectionRef = useRef(null);

  useEffect(() => {
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
          ".hero-action-button-row",
          { opacity: 0, y: 20, duration: 0.5 },
          "-=0.3"
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
        x: 60, y: -40, scale: 1.15, opacity: 0.6,
        duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(".hero-glow-2", {
        x: -50, y: 50, scale: 0.9, opacity: 0.4,
        duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2,
      });
      gsap.to(".hero-glow-3", {
        x: 40, y: 30, scale: 1.1, opacity: 0.5,
        duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
              {" "}&mdash; design&nbsp;&harr;&nbsp;code
            </p>
            <p className="hero-description-paragraph">
              7+ years designing and shipping production SaaS interfaces. I own the full pipeline —
              Figma wireframes through to deployed React components — with deep expertise in
              design systems, WCAG accessibility, and mobile-first UX.
            </p>
            <div className="hero-action-button-row">
              <MagneticButton href="#projects" className="button-filled">View my work &rarr;</MagneticButton>
              <MagneticButton href="#contact" className="button-outlined">Get in touch</MagneticButton>
            </div>
          </div>

          <div className="hero-right-panel">
            <div className="hero-stats-row">
              <AnimatedStat endValue={7} suffix="+" descriptor={"Years in\nSaaS"} />
              <div className="hero-stat-item">
                <div className="hero-stat-number">Design ↔ Code</div>
                <div className="hero-stat-descriptor" style={{ whiteSpace: "pre-line" }}>{"Full\npipeline"}</div>
              </div>
              <AnimatedStat endValue={18} suffix="" descriptor={"Screen spec\ndelivered"} />
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
