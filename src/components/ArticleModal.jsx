import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./ArticleModal.scss";

gsap.registerPlugin(ScrollTrigger);

/* ===== ANIMATED ILLUSTRATIONS ===== */

function OutcomeIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Animate the outcome rings expanding
      gsap.fromTo(".ood-ring", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)", stagger: 0.15, delay: 0.3,
      });
      // Pulse the center dot
      gsap.to(".ood-center", {
        scale: 1.3, opacity: 0.6, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      // Draw the connecting lines
      gsap.fromTo(".ood-spoke", { strokeDashoffset: 100 }, {
        strokeDashoffset: 0, duration: 0.8, stagger: 0.1, delay: 0.6, ease: "power2.out",
      });
      // Float the metric labels
      gsap.fromTo(".ood-label", { opacity: 0, y: 10 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 1.0, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Concentric outcome rings */}
      <circle className="ood-ring" cx="200" cy="140" r="120" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 140px" }} />
      <circle className="ood-ring" cx="200" cy="140" r="85" stroke="var(--color-accent-border)" strokeWidth="1" fill="none" style={{ transformOrigin: "200px 140px" }} />
      <circle className="ood-ring" cx="200" cy="140" r="50" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" style={{ transformOrigin: "200px 140px" }} />
      {/* Center point - the outcome */}
      <circle className="ood-center" cx="200" cy="140" r="6" fill="var(--color-accent)" style={{ transformOrigin: "200px 140px" }} />
      {/* Spokes connecting to metrics */}
      <line className="ood-spoke" x1="200" y1="140" x2="120" y2="60" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      <line className="ood-spoke" x1="200" y1="140" x2="300" y2="55" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      <line className="ood-spoke" x1="200" y1="140" x2="320" y2="200" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      <line className="ood-spoke" x1="200" y1="140" x2="100" y2="210" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="100" opacity="0.4" />
      {/* Metric labels at spoke endpoints */}
      <text className="ood-label" x="120" y="50" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">RETENTION</text>
      <text className="ood-label" x="300" y="45" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">ACTIVATION</text>
      <text className="ood-label" x="330" y="220" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">CONVERSION</text>
      <text className="ood-label" x="85" y="230" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">SATISFACTION</text>
      {/* Small dots at endpoints */}
      <circle className="ood-label" cx="120" cy="60" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle className="ood-label" cx="300" cy="55" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle className="ood-label" cx="320" cy="200" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle className="ood-label" cx="100" cy="210" r="3" fill="var(--color-accent)" opacity="0.6" />
    </svg>
  );
}

function SpecIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Draw the spec document outline
      gsap.fromTo(".sdd-doc", { strokeDashoffset: 600 }, {
        strokeDashoffset: 0, duration: 1.2, ease: "power2.out", delay: 0.2,
      });
      // Spec lines appear
      gsap.fromTo(".sdd-line", { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.6, ease: "power2.out",
      });
      // Arrow pulses from spec to code
      gsap.fromTo(".sdd-arrow", { opacity: 0, x: -10 }, {
        opacity: 1, x: 0, duration: 0.5, delay: 1.2, ease: "power2.out",
      });
      gsap.to(".sdd-arrow-pulse", {
        x: 20, opacity: 0, duration: 1.2, repeat: -1, ease: "power1.out", delay: 1.5,
      });
      // Code block appears
      gsap.fromTo(".sdd-code", { opacity: 0, x: 20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.06, delay: 1.4, ease: "power2.out",
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Spec document */}
      <rect className="sdd-doc" x="30" y="30" width="140" height="200" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="600" fill="none" />
      <text x="60" y="55" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">SPEC.MD</text>
      {/* Spec content lines */}
      <rect className="sdd-line" x="50" y="75" width="100" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.4" style={{ transformOrigin: "50px 76px" }} />
      <rect className="sdd-line" x="50" y="90" width="80" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 91px" }} />
      <rect className="sdd-line" x="50" y="105" width="95" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.4" style={{ transformOrigin: "50px 106px" }} />
      <rect className="sdd-line" x="50" y="120" width="70" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" style={{ transformOrigin: "50px 121px" }} />
      <rect className="sdd-line" x="50" y="145" width="90" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.6" style={{ transformOrigin: "50px 146px" }} />
      <rect className="sdd-line" x="50" y="160" width="60" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "50px 161px" }} />
      <rect className="sdd-line" x="50" y="175" width="85" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.6" style={{ transformOrigin: "50px 176px" }} />
      <rect className="sdd-line" x="50" y="190" width="50" height="2" rx="1" fill="var(--color-accent-border)" opacity="0.4" style={{ transformOrigin: "50px 191px" }} />
      {/* Arrow: spec -> code */}
      <g className="sdd-arrow">
        <line x1="190" y1="130" x2="220" y2="130" stroke="var(--color-accent)" strokeWidth="1.5" />
        <polygon points="220,125 230,130 220,135" fill="var(--color-accent)" />
      </g>
      <circle className="sdd-arrow-pulse" cx="210" cy="130" r="3" fill="var(--color-accent)" opacity="0.5" />
      {/* AI label */}
      <text className="sdd-arrow" x="210" y="118" textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1.5">AI</text>
      {/* Code output */}
      <rect className="sdd-code" x="240" y="30" width="140" height="200" rx="4" stroke="var(--color-border)" strokeWidth="1" fill="none" />
      <text className="sdd-code" x="264" y="55" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">output.tsx</text>
      <text className="sdd-code" x="258" y="80" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">{"const"}</text>
      <text className="sdd-code" x="290" y="80" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">App = () =&gt;</text>
      <rect className="sdd-code" x="258" y="95" width="80" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
      <rect className="sdd-code" x="268" y="110" width="60" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.25" />
      <rect className="sdd-code" x="268" y="125" width="70" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
      <rect className="sdd-code" x="258" y="140" width="50" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.25" />
      <text className="sdd-code" x="258" y="165" fill="var(--color-accent)" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">{"export"}</text>
      <rect className="sdd-code" x="258" y="180" width="90" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.3" />
      <rect className="sdd-code" x="258" y="195" width="65" height="2" rx="1" fill="var(--color-text-secondary)" opacity="0.25" />
    </svg>
  );
}

function PipelineIllustration() {
  const svgRef = useRef(null);
  const { isReduced } = useTheme();

  useEffect(() => {
    if (isReduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      // Draw the three stage boxes
      gsap.fromTo(".pip-box", { strokeDashoffset: 400, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.25, delay: 0.2, ease: "power2.out",
      });
      // Labels appear
      gsap.fromTo(".pip-label", { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.25, delay: 0.5, ease: "power2.out",
      });
      // Draw connecting arrows
      gsap.fromTo(".pip-arrow", { strokeDashoffset: 60, opacity: 0 }, {
        strokeDashoffset: 0, opacity: 1, duration: 0.5, stagger: 0.2, delay: 1.0, ease: "power2.out",
      });
      // Pulse the sync indicators
      gsap.fromTo(".pip-sync", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.3, stagger: 0.15, delay: 1.5, ease: "back.out(2)",
      });
      gsap.to(".pip-sync", {
        scale: 1.3, opacity: 0.5, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.0,
      });
    }, svgRef);
    return () => ctx.revert();
  }, [isReduced]);

  return (
    <svg ref={svgRef} className="article-illustration" viewBox="0 0 400 280" fill="none">
      {/* Figma stage */}
      <rect className="pip-box" x="20" y="80" width="100" height="120" rx="4" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="400" fill="none" style={{ transformOrigin: "70px 140px" }} />
      <text className="pip-label" x="70" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">FIGMA</text>
      <text className="pip-label" x="70" y="135" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Tokens</text>
      <text className="pip-label" x="70" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Wireframes</text>
      <text className="pip-label" x="70" y="165" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Components</text>
      {/* Arrow 1 */}
      <line className="pip-arrow" x1="130" y1="140" x2="148" y2="140" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="60" />
      <polygon className="pip-arrow" points="148,135 158,140 148,145" fill="var(--color-accent)" opacity="0.8" />
      {/* Storybook stage */}
      <rect className="pip-box" x="160" y="80" width="100" height="120" rx="4" stroke="var(--color-accent-border)" strokeWidth="1.5" strokeDasharray="400" fill="none" style={{ transformOrigin: "210px 140px" }} />
      <text className="pip-label" x="210" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">STORYBOOK</text>
      <text className="pip-label" x="210" y="135" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Documentation</text>
      <text className="pip-label" x="210" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Isolation</text>
      <text className="pip-label" x="210" y="165" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">Testing</text>
      {/* Arrow 2 */}
      <line className="pip-arrow" x1="270" y1="140" x2="288" y2="140" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="60" />
      <polygon className="pip-arrow" points="288,135 298,140 288,145" fill="var(--color-accent)" opacity="0.8" />
      {/* Production stage */}
      <rect className="pip-box" x="300" y="80" width="100" height="120" rx="4" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="400" fill="none" style={{ transformOrigin: "350px 140px" }} />
      <text className="pip-label" x="350" y="110" textAnchor="middle" fill="var(--color-accent)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">PRODUCTION</text>
      <text className="pip-label" x="350" y="135" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">React + SCSS</text>
      <text className="pip-label" x="350" y="150" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">CI/CD</text>
      <text className="pip-label" x="350" y="165" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="8" fontFamily="var(--font-mono)">GitHub Pages</text>
      {/* Sync indicators */}
      <circle className="pip-sync" cx="145" cy="140" r="4" fill="var(--color-accent)" style={{ transformOrigin: "145px 140px" }} />
      <circle className="pip-sync" cx="285" cy="140" r="4" fill="var(--color-accent)" style={{ transformOrigin: "285px 140px" }} />
      {/* Token flow line underneath */}
      <path className="pip-arrow" d="M70 210 Q210 240 350 210" stroke="var(--color-accent-border)" strokeWidth="1" strokeDasharray="60" fill="none" />
      <text className="pip-label" x="210" y="255" textAnchor="middle" fill="var(--color-text-disabled)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="2">SHARED DESIGN TOKENS</text>
    </svg>
  );
}

/* ===== ARTICLE CONTENT ===== */

const ARTICLES = {
  "outcome-oriented-design": {
    title: "Outcome-oriented design",
    subtitle: "Why AI is shifting UX from pixels to purpose",
    date: "March 2026",
    readTime: "6 min read",
    illustration: OutcomeIllustration,
    sections: [
      {
        heading: "Outputs are getting cheaper",
        body: `For most of UX history, the craft has been measured by its outputs. Wireframes delivered, screens designed, prototypes built. The implicit assumption: more polished artefacts lead to better products. That assumption is breaking down.

AI tools like Figma Make, Galileo, and Relume can now generate full UI compositions from a text prompt, matching brand tokens, spacing conventions, and component patterns. 33% of designers already use AI to generate visual assets, and 22% use it for first-draft interfaces (Figma, 2025). When the output becomes trivially easy to produce, the competitive advantage shifts to knowing which output to produce and why.

This is the core of outcome-oriented design: rather than optimising for the quality of deliverables, you optimise for the measurable changes those deliverables create. Not "did we ship a new onboarding flow?" but "did activation increase by 12%?"`,
      },
      {
        heading: "What changes in practice",
        body: `The shift plays out in three areas.

First, research becomes continuous rather than front-loaded. Tools like Dovetail and Maze now auto-classify qualitative feedback, detect emerging themes at scale, and generate dynamic follow-up questions during interviews. Teams report 63% faster research turnaround. The result: designers can run lightweight validation at any point in the cycle, not just during a dedicated "discovery phase."

Second, variation becomes cheap. AI can produce multiple viable design directions in minutes. Instead of presenting one carefully refined concept, teams can test four rough concepts against outcome metrics and invest polish only in the one that performs. The designer's judgment shifts from "which layout is best?" to "which hypothesis is most worth testing?"

Third, measurement becomes a design skill. When the output itself is AI-assisted, the differentiating capability is connecting design decisions to business and user outcomes: retention, activation, task completion, satisfaction. Companies that tie UX metrics to business outcomes are significantly more likely to scale successful digital products.`,
      },
      {
        heading: "Designing for AI agents",
        body: `There is a deeper shift happening too. As AI evolves from passive chat tools to autonomous agents that plan, execute, and iterate on their own, the nature of the interface is changing.

The emerging paradigm is delegative UI: instead of walking a user through a series of steps, you assign an AI a goal and let it figure out the path. UX work becomes less about shaping individual screens and more about shaping the boundaries of what an agent is allowed to do, how it communicates its progress, and how it handles failure gracefully.

Trust becomes the central design challenge. Transparency, control, consistency, and graceful degradation are not new principles, but they take on new weight when the user is delegating real decisions to a system they cannot fully predict.`,
      },
      {
        heading: "Where UX Engineers fit",
        body: `This shift increases the value of people who sit at the intersection of design and engineering. When AI handles output generation, the scarce skills are:

Understanding user needs deeply enough to define the right outcomes. Building the design systems and constraints that guide AI output. Implementing the measurement infrastructure that connects design decisions to results. And prototyping rapidly using AI tools, with the technical literacy to evaluate what AI actually produces.

The designer's role is evolving from controller to curator, from pixel-pusher to strategic thinker. NN/g's State of UX 2026 report puts it plainly: "Surface-level design won't be enough to stay competitive." The future belongs to people who combine adaptability, strategy, and discernment, and who can work fluently across the full pipeline from research through to production code.`,
      },
    ],
  },
  "spec-driven-development": {
    title: "Spec-driven development",
    subtitle: "Writing specifications that AI turns into code",
    date: "March 2026",
    readTime: "7 min read",
    illustration: SpecIllustration,
    sections: [
      {
        heading: "The problem with vibe coding",
        body: `Vibe coding, the practice of building software by conversing with an AI assistant in natural language, ships prototypes fast. You describe what you want, the AI generates code, you iterate. For side projects and throwaway experiments, it works.

But vibe coding hits a documented wall. Around three months in, the technical debt compounds into a maintenance crisis. Without structure, AI-generated code accumulates inconsistencies, duplicated logic, and implicit assumptions that no one recorded. If another team member wants to contribute, they have to reverse-engineer intent from source code. The AI is good at pattern completion, but it is not good at reading your mind about architecture, constraints, and trade-offs.

Spec-driven development (SDD) is the emerging response. Identified by Thoughtworks as one of the most important new engineering practices of 2025, it inverts the traditional workflow: the specification is the source of truth, and the code is a generated secondary artefact. The spec declares intent. The code realises it.`,
      },
      {
        heading: "How SDD works",
        body: `The workflow breaks into four phases.

Specify: define what you are building and why through user journeys, success criteria, and constraints. Plan: establish architecture, stack choices, and boundaries. Tasks: break the spec into small, testable work units. Implement: hand each task to an AI agent to generate the code.

Real tooling exists for this. GitHub's Spec Kit provides a four-command CLI: /specify, /plan, /tasks, /implement. It works with Copilot, Claude Code, and Cursor. Amazon Kiro is building spec-driven workflows directly into an IDE. Fission AI's OpenSpec enforces a strict three-phase state machine with delta markers for tracking changes.

The critical insight is that specs are not just documentation. They are the interface between human intent and machine execution. Empirical studies suggest well-structured specs reduce AI coding errors by up to 50%, and prompts with explicit specifications cut back-and-forth refinements by 68%. The spec is doing real work.`,
      },
      {
        heading: "Writing specs that work",
        body: `Addy Osmani's widely cited framework for writing AI-ready specs recommends starting like a PRD (user-centric context, the "why" behind each feature) and expanding like an SRS (specific technical details: database schema, API contracts, framework choices).

Good specs cover six areas: commands, testing strategy, project structure, code style, git workflow, and boundaries. That last one is important. A three-tier boundary system, always do (safe actions), ask first (high-impact changes), never do (hard stops), gives the AI agent clear guardrails without micromanaging every line of output.

The key lesson from early adopters: break work into modular tasks. Research shows AI models struggle with too many simultaneous instructions (the "curse of instructions"). A single huge prompt produces worse results than a sequence of focused ones, each grounded in the same spec.

This is not waterfall. Unlike traditional spec-heavy approaches with long feedback loops, SDD provides tight cycles by combining rigorous specification with rapid AI code generation. Traditional specs are advisory; SDD specs are enforced through tests that fail if the code diverges.`,
      },
      {
        heading: "The UX Engineer advantage",
        body: `This is where the two disciplines converge. A UX engineer who understands both design and code is ideally positioned for spec-driven development.

Design systems are already specifications. Tokens, component APIs, interaction patterns, accessibility requirements: these are contracts between design intent and implementation. SDD extends this thinking from the component level to the full application.

The spec itself is a design artefact. It captures user journeys, success metrics, and constraints, all of which require the research, empathy, and strategic thinking that sit at the heart of UX practice. When AI writes the code, the differentiating skill is not typing speed. It is the ability to articulate what to build and why, with enough precision that a machine can execute it faithfully.

Vibe coding and SDD are not opposed. The consensus in 2026 is that they are complementary: vibe coding for early exploration and rapid prototyping, SDD for production systems requiring maintainability, collaboration, and reliability. The people who will thrive are those who can move fluently between the two modes, and who have the cross-disciplinary literacy to write specs that cover both the user experience and the technical architecture.`,
      },
    ],
  },
  "design-to-production-pipeline": {
    title: "The design-to-production pipeline",
    subtitle: "How Figma, Storybook, and React share a single source of truth",
    date: "March 2026",
    readTime: "5 min read",
    illustration: PipelineIllustration,
    sections: [
      {
        heading: "One system, three surfaces",
        body: `Most design systems have a gap. Designers maintain a Figma library. Developers maintain a component library. The two drift apart, and nobody notices until a QA engineer flags that the button radius in production does not match the mockup.

The portfolio you are reading right now is built to close that gap. The same set of design tokens (colours, typography, spacing, radii) powers three surfaces simultaneously: a Figma file via Tokens Studio, a Storybook instance documenting every component, and the live production site. Change a token in one place and it propagates to the others.

This is not a theoretical exercise. It is the workflow I use in production, and it is the workflow I built this site to demonstrate.`,
      },
      {
        heading: "Figma: where decisions are made",
        body: `The pipeline starts in Figma. Design tokens are defined using the Tokens Studio plugin, which stores them as structured JSON: colour primitives, semantic aliases, typography scales, border radii. Each token has a name, a value, and a type.

The key detail: tokens are organised into sets. This site has a Dark set and a Light set, with identical token names but different values. Toggle between them in Figma and every frame updates. The same mechanism drives the theme toggle on this site.

Wireframes and component mockups reference tokens by name, not by raw hex value. A background fill is not "#0b0b0b". It is "color.background". This indirection is what makes the entire pipeline possible. When the value changes, the name stays stable, and everything downstream picks it up.`,
      },
      {
        heading: "Storybook: where components are isolated",
        body: `From Figma, the same tokens flow into code as SCSS variables, compiled to CSS custom properties on :root. Every React component consumes them via var(--color-accent), var(--font-display), and so on. No hardcoded values.

Storybook documents these components in isolation. Each story renders a component with interactive controls (Storybook's args system), and the ThemeProvider wraps everything so the Dark/Light toggle works exactly as it does on the live site.

This is where the design system proves itself. If a component looks wrong in Storybook, it will look wrong in production. There is no "it works on my machine" problem because Storybook and the site consume identical tokens and identical component code. The Storybook instance is built alongside the site in the same CI pipeline and deployed to the same domain.`,
      },
      {
        heading: "Production: where it ships",
        body: `The final surface is the live site. Every push to main triggers a GitHub Actions workflow: Vite builds the site, Storybook builds alongside it, and both deploy to GitHub Pages. A second workflow runs Lighthouse audits and commits the scores back to the repo.

The production site does not import a separate copy of the design system. It is the design system. The components you see on this page are the same components documented in Storybook, consuming the same tokens defined in Figma.

This has a practical benefit beyond consistency. When a hiring manager asks "show me your design system work," I do not need to switch between tools. The portfolio itself is the artefact: tokens visible in the Design System section, components interactive in Storybook, the Figma file linked alongside, and real Lighthouse scores proving the whole thing performs in production.`,
      },
      {
        heading: "Why this matters for teams",
        body: `For a solo portfolio, this pipeline is admittedly over-engineered. But it demonstrates a workflow that scales to teams.

In a team setting, a designer updates a colour token in Figma. Tokens Studio syncs the change to a JSON file in the repository via a pull request. A developer reviews and merges. The CI pipeline rebuilds Storybook and the site. Every surface updates from a single change.

The reverse works too. If a developer adds a new component in code, they document it in Storybook. The designer sees it in the Storybook instance and references it in future Figma work. There is no "throw it over the wall" handoff because both sides are working from the same system.

The people who thrive in this workflow are those who understand both sides: designers who can read a component's prop interface, and developers who can interpret a Figma frame's token bindings. That intersection is exactly where a UX Engineer operates.`,
      },
    ],
  },
};

/* ===== MODAL COMPONENT ===== */

export default function ArticleModal({ articleId, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const triggersRef = useRef([]);
  const { isReduced } = useTheme();

  const cleanup = useCallback(() => {
    triggersRef.current.forEach((st) => st.kill());
    triggersRef.current = [];
  }, []);

  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;

    document.body.style.overflow = "hidden";

    if (isReduced) {
      return () => { document.body.style.overflow = ""; };
    }

    const scroller = scrollContainerRef.current;

    // Entrance animation
    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    entranceTl
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(scroller, { y: "100%" }, { y: "0%", duration: 0.6, ease: "power4.out" }, "-=0.15")
      .fromTo(".am-hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
      .fromTo(".am-hero-title", { opacity: 0, y: 50, skewY: 3 }, { opacity: 1, y: 0, skewY: 0, duration: 0.6 }, "-=0.3")
      .fromTo(".am-hero-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
      .fromTo(".am-hero-meta span", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, "-=0.2");

    // Scroll-triggered section reveals
    document.querySelectorAll(".am-section").forEach((section) => {
      const st = ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(section,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
        },
      });
      triggersRef.current.push(st);
    });

    return () => {
      cleanup();
      document.body.style.overflow = "";
    };
  }, [isOpen, articleId, cleanup, isReduced]);

  const handleClose = useCallback(() => {
    if (isReduced) {
      cleanup();
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        cleanup();
        onClose();
      },
    });
    tl.to(scrollContainerRef.current, { y: "100%", duration: 0.45, ease: "power3.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.15");
  }, [isReduced, cleanup, onClose]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen || !articleId) return null;

  const article = ARTICLES[articleId];
  if (!article) return null;

  const Illustration = article.illustration;

  return (
    <div className="am-overlay" ref={overlayRef}>
      <div className="am-scroll-container" ref={scrollContainerRef}>
        <button className="am-close-button" onClick={handleClose} aria-label="Close article">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <article className="am-article">
          {/* Hero */}
          <header className="am-hero">
            <span className="am-hero-eyebrow">Article</span>
            <h1 className="am-hero-title">{article.title}</h1>
            <p className="am-hero-subtitle">{article.subtitle}</p>
            <div className="am-hero-meta">
              <span>{article.date}</span>
              <span className="am-meta-separator">&middot;</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          {/* Illustration */}
          <div className="am-illustration-wrapper">
            <Illustration />
          </div>

          {/* Body sections */}
          <div className="am-body">
            {article.sections.map((section, i) => (
              <section key={i} className="am-section" style={isReduced ? undefined : { opacity: 0 }}>
                <h2 className="am-section-heading">{section.heading}</h2>
                {section.body.split("\n\n").map((paragraph, j) => (
                  <p key={j} className="am-section-paragraph">{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
