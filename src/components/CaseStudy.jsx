import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./CaseStudy.scss";

gsap.registerPlugin(ScrollTrigger);

const ICON_SVG_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const META = [
  { label: "Role", value: "Solo, design + build" },
  { label: "Timeline", value: "Ongoing side project" },
  { label: "Scope", value: "Research, UX, UI, full-stack" },
  { label: "Stack", value: "React, Supabase, Stripe" },
];

const PROBLEMS = [
  {
    label: "The website",
    title: "A brochure that never earns its keep",
    description:
      "Most small gyms run a placeholder site: a logo, a class list, maybe a contact form. But 88% of people who search on a phone visit a business within a week, and the gyms that grow treat their website as an acquisition tool, not a digital flyer. A static brochure ranks poorly and converts nobody, while every transaction happens somewhere else entirely.",
  },
  {
    label: "The five apps",
    title: "Booking that lives off-brand, behind a tax",
    description:
      "Class booking, memberships, payments, and WOD programming get bolted on through BoxMate, GoTeamUp, or Wodify. Members are bounced to a third-party portal, or told to download a generic app with someone else's name on it. That friction pushes people away, and the owner pays a recurring per-member fee that scales worst for the smallest gyms.",
  },
];

const DECISIONS = [
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
      </svg>
    ),
    title: "Multi-tenant on row-level security",
    reasoning:
      "One codebase serves every gym, each an isolated, fully branded tenant via Supabase RLS. This is what removes the per-member tax: infinite gyms at near-zero marginal cost, instead of a price that climbs with every member you sign.",
  },
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Branded storefronts from one config",
    reasoning:
      "Each gym gets a themed public site, their logo, colours, and hero imagery, generated from a single config object. Booking lives on the gym's own domain, so members never leave the brand for a third-party portal, and the site itself becomes the thing search engines rank.",
  },
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Optimistic booking UI",
    reasoning:
      "Bookings, waitlists, and cancellations update instantly and reconcile in the background. The friction that drives members toward easier apps disappears, because the gym's own site is now the fastest place to book a class.",
  },
];

const FEATURES = [
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    ),
    title: "Class Booking Engine",
    description: "Real-time timetable with capacity tracking, waitlists, cancellation policies, and calendar sync, all optimistically updated.",
  },
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Stripe Payments",
    description: "Subscription billing with Stripe Checkout. Webhooks handle plan changes, failed payments, and invoices server-side.",
  },
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <path d="M6 5v14" />
        <path d="M18 5v14" />
        <path d="M3 8v8" />
        <path d="M21 8v8" />
        <path d="M6 12h12" />
      </svg>
    ),
    title: "WOD Programming",
    description: "Coaches publish daily workouts with movement libraries. Members log scores and track PRs through a personal dashboard.",
  },
  {
    icon: (
      <svg {...ICON_SVG_PROPS}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Coach Profiles & Roles",
    description: "Role-based access: owners manage billing, coaches publish content, members book classes. All enforced at the RLS layer.",
  },
];

const METRICS = [
  { value: 5, suffix: "→1", label: "Apps consolidated" },
  { value: 1, suffix: "", label: "Branded domain" },
  { value: 6, suffix: "", label: "Modules, one codebase" },
  { value: 100, suffix: "%", label: "Solo-built" },
];

const PROCESS_STEPS = [
  { phase: "01", title: "Research", detail: "Audited the incumbent stack (BoxMate, GoTeamUp, Wodify) and the placeholder-website pattern. Mapped the jobs-to-be-done for owners, coaches, and members." },
  { phase: "02", title: "Wireframes", detail: "Low-fi flows in Figma covering discovery, onboarding, booking, payments, and admin. Validated the booking journey against the friction in existing tools." },
  { phase: "03", title: "Design System", detail: "Built a token-based system: colour, spacing, type scales, so every tenant can be rebranded from config. Components documented in Storybook." },
  { phase: "04", title: "Engineering", detail: "React 19 + TypeScript frontend, Supabase backend with RLS, Stripe integration, Docker dev environment." },
  { phase: "05", title: "Ship & Iterate", detail: "Deployed to Vercel edge with continuous deployment from main and preview URLs per PR." },
];

const OUTCOMES = [
  { stat: "5 → 1", label: "tools collapsed into the gym's own website" },
  { stat: "£0", label: "per-member fees, replaced by a flat multi-tenant model" },
  { stat: "1 domain", label: "for discovery, booking, and payments, all on-brand" },
];

function MetricCard({ endValue, suffix, label, isReduced }) {
  return (
    <div className="cs-metric-card">
      <span className="cs-metric-value" data-end={endValue} data-suffix={suffix}>
        {isReduced ? endValue + suffix : "0" + suffix}
      </span>
      <span className="cs-metric-label">{label}</span>
    </div>
  );
}

export default function CaseStudy({ isOpen, onClose, onOpenArticle }) {
  const overlayRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);
  const triggersRef = useRef([]);
  const { isReduced } = useTheme();

  const cleanup = useCallback(() => {
    triggersRef.current.forEach((st) => st.kill());
    triggersRef.current = [];
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.scroller === scrollContainerRef.current) st.kill();
    });
  }, []);

  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;

    document.body.style.overflow = "hidden";

    if (isReduced) {
      return () => { document.body.style.overflow = ""; };
    }

    const scroller = scrollContainerRef.current;

    // --- Entrance ---
    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    entranceTl
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(scroller, { y: "100%" }, { y: "0%", duration: 0.6, ease: "power4.out" }, "-=0.15")
      .fromTo(".cs-hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
      .fromTo(".cs-hero-title", { opacity: 0, y: 50, skewY: 3 }, { opacity: 1, y: 0, skewY: 0, duration: 0.6 }, "-=0.3")
      .fromTo(".cs-hero-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
      .fromTo(".cs-hero-chip", { opacity: 0, scale: 0.8, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.04 }, "-=0.25")
      .fromTo(".cs-hero-links a", { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.08 }, "-=0.2")
      .fromTo(".cs-close-button", { opacity: 0, rotate: -180 }, { opacity: 1, rotate: 0, duration: 0.4 }, "-=0.4");

    // --- Metrics count-up ---
    document.querySelectorAll(".cs-metric-value").forEach((el) => {
      const endValue = parseInt(el.dataset.end, 10);
      const suffix = el.dataset.suffix || "";
      const counter = { val: 0 };
      const st = ScrollTrigger.create({
        trigger: el.closest(".cs-metric-card"),
        scroller,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: endValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(counter.val) + suffix;
            },
          });
        },
      });
      triggersRef.current.push(st);
    });

    // --- Parallax hero image placeholder ---
    const heroSt = ScrollTrigger.create({
      trigger: heroRef.current,
      scroller,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(".cs-hero-bg-layer", { y: self.progress * 120 });
      },
    });
    triggersRef.current.push(heroSt);

    // --- Process timeline draw-on ---
    const processLine = document.querySelector(".cs-process-line-fill");
    if (processLine) {
      const st = ScrollTrigger.create({
        trigger: ".cs-process-section",
        scroller,
        start: "top 70%",
        end: "bottom 50%",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(processLine, { scaleY: self.progress });
        },
      });
      triggersRef.current.push(st);
    }

    // --- Process step reveals ---
    document.querySelectorAll(".cs-process-step").forEach((step, i) => {
      const st = ScrollTrigger.create({
        trigger: step,
        scroller,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(step,
            { opacity: 0, x: i % 2 === 0 ? -40 : 40, rotateY: i % 2 === 0 ? -8 : 8 },
            { opacity: 1, x: 0, rotateY: 0, duration: 0.6, ease: "power3.out", delay: 0.05 }
          );
        },
      });
      triggersRef.current.push(st);
    });

    // --- Generic card reveals (problem, decision, outcome) ---
    document.querySelectorAll(".cs-reveal-card").forEach((card) => {
      const st = ScrollTrigger.create({
        trigger: card,
        scroller,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.fromTo(card,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", delay: parseFloat(card.dataset.delay || 0) }
          );
        },
      });
      triggersRef.current.push(st);
    });

    // --- Feature cards stagger ---
    const featureCards = document.querySelectorAll(".cs-feature-card");
    featureCards.forEach((card, i) => {
      const st = ScrollTrigger.create({
        trigger: card,
        scroller,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.fromTo(card,
            { opacity: 0, y: 40, rotateX: 10, scale: 0.95 },
            { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "power3.out", delay: (i % 4) * 0.06 }
          );
        },
      });
      triggersRef.current.push(st);
    });

    return () => {
      cleanup();
      document.body.style.overflow = "";
    };
  }, [isOpen, cleanup, isReduced]);

  const handleClose = () => {
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
  };

  if (!isOpen) return null;

  return (
    <div className="cs-overlay" ref={overlayRef}>
      <div className="cs-scroll-container" ref={scrollContainerRef}>
        <button className="cs-close-button" onClick={handleClose} aria-label="Close case study">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ===== HERO ===== */}
        <div className="cs-hero" ref={heroRef}>
          <div className="cs-hero-bg-layer" />
          <div className="cs-hero-content">
            <span className="cs-hero-eyebrow">Case Study</span>
            <h1 className="cs-hero-title">NoSweat<br />Fitness</h1>
            <p className="cs-hero-subtitle">
              Small gyms juggle five apps and a dead-weight website. NoSweat makes
              the website the whole business: discovery, booking, payments, and
              programming on the gym's own brand, not a third party's app.
            </p>
            <div className="cs-hero-chips">
              {["React 19", "TypeScript", "SCSS Modules", "Supabase", "Stripe", "Docker", "Vercel"].map((t) => (
                <span key={t} className="skill-chip cs-hero-chip">{t}</span>
              ))}
            </div>
            <div className="cs-hero-links">
              <a href="https://github.com/alex-bramwell/nosweat" target="_blank" rel="noopener">&uarr; GitHub</a>
              <a href="https://nosweat.fitness" target="_blank" rel="noopener">&rarr; Live demo</a>
            </div>
          </div>
        </div>

        {/* ===== METADATA ===== */}
        <div className="cs-meta-strip">
          {META.map((m) => (
            <div key={m.label} className="cs-meta-item">
              <span className="cs-meta-label">{m.label}</span>
              <span className="cs-meta-value">{m.value}</span>
            </div>
          ))}
        </div>

        {/* ===== PROBLEM ===== */}
        <section className="cs-section cs-problem-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">The Problem</span>
            <h2 className="cs-section-heading">Two failures, bundled&nbsp;together</h2>
            <p className="cs-lead-text">
              A small gym today runs on a stack of stitched-together tools, and the
              split creates two distinct failures, one in front of new members and
              one behind the existing ones.
            </p>
            <div className="cs-problem-grid">
              {PROBLEMS.map((p, i) => (
                <div key={p.label} className="cs-problem-card cs-reveal-card" data-delay={i * 0.08}>
                  <span className="cs-problem-label">{p.label}</span>
                  <h3 className="cs-problem-title">{p.title}</h3>
                  <p className="cs-problem-description">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OBJECTIVE ===== */}
        <section className="cs-section cs-objective-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Objective</span>
            <p className="cs-objective-text">
              Replace the brochure site and the five-app stack with one branded
              property the gym actually owns, with zero booking friction and no
              per-member tax.
            </p>
          </div>
        </section>

        {/* ===== METRICS ===== */}
        <div className="cs-metrics-strip">
          {METRICS.map((m) => (
            <MetricCard key={m.label} endValue={m.value} suffix={m.suffix} label={m.label} isReduced={isReduced} />
          ))}
        </div>

        {/* ===== TEAM CONTEXT ===== */}
        <div className="cs-team-context">
          <p className="cs-team-context-text">
            <span className="cs-team-context-icon" aria-hidden="true">&#9670;</span>
            Built solo to demonstrate full-stack range. In a team setting, I would
            collaborate with backend engineers on RLS policies and data modelling,
            work alongside product designers on research and validation, and pair
            with QA on test coverage. The decisions here reflect breadth of
            ownership, not a preference for working alone.
          </p>
        </div>

        {/* ===== PROCESS ===== */}
        <section className="cs-section cs-process-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Process</span>
            <h2 className="cs-section-heading">From research to&nbsp;release</h2>
            <div className="cs-process-timeline">
              <div className="cs-process-line">
                <div className="cs-process-line-fill" />
              </div>
              {PROCESS_STEPS.map((step) => (
                <div key={step.phase} className="cs-process-step" style={{ perspective: "600px" }}>
                  <div className="cs-process-step-marker">{step.phase}</div>
                  <div className="cs-process-step-body">
                    <h3 className="cs-process-step-title">{step.title}</h3>
                    <p className="cs-process-step-detail">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== KEY DECISIONS ===== */}
        <section className="cs-section cs-decisions-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Key Decisions</span>
            <h2 className="cs-section-heading">How the problem shaped the&nbsp;build</h2>
            <div className="cs-decisions-list">
              {DECISIONS.map((d, i) => (
                <div key={d.title} className="cs-decision-card cs-reveal-card" data-delay={i * 0.06}>
                  <span className="cs-decision-icon">{d.icon}</span>
                  <div className="cs-decision-body">
                    <h3 className="cs-decision-title">{d.title}</h3>
                    <p className="cs-decision-reasoning">{d.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="cs-section cs-features-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Features</span>
            <h2 className="cs-section-heading">What lands on the gym's&nbsp;site</h2>
            <div className="cs-features-grid" style={{ perspective: "800px" }}>
              {FEATURES.map((f) => (
                <div key={f.title} className="cs-feature-card">
                  <span className="cs-feature-icon">{f.icon}</span>
                  <h3 className="cs-feature-title">{f.title}</h3>
                  <p className="cs-feature-description">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== RESULTS ===== */}
        <section className="cs-section cs-results-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Outcome</span>
            <h2 className="cs-section-heading">One property, not&nbsp;five subscriptions</h2>
            <div className="cs-outcome-grid">
              {OUTCOMES.map((o, i) => (
                <div key={o.label} className="cs-outcome-card cs-reveal-card" data-delay={i * 0.08}>
                  <span className="cs-outcome-stat">{o.stat}</span>
                  <span className="cs-outcome-label">{o.label}</span>
                </div>
              ))}
            </div>
            <p className="cs-results-note">
              Built as a working demonstration rather than a live commercial product,
              NoSweat proves the model end to end: the gym owner gets a fast,
              search-ready website and the full operational stack on one property
              they own outright. The next step is putting it in front of a real box
              and measuring booking conversion and retention against the incumbent
              tools.
            </p>
          </div>
        </section>

        {/* ===== DEEP DIVE ===== */}
        <section className="cs-section cs-deep-dive-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Deep dive</span>
            <h2 className="cs-section-heading">The full story</h2>
            <p className="cs-deep-dive-text">
              How this project evolved from a single-gym prototype to a multi-tenant
              SaaS platform across 474 commits, 59 database migrations, and months of iteration.
            </p>
            <button
              className="cs-deep-dive-button"
              onClick={() => onOpenArticle && onOpenArticle("nosweat-fitness-deep-dive")}
            >
              Read the deep dive &rarr;
            </button>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cs-section cs-cta-section">
          <div className="cs-section-inner cs-cta-inner">
            <h2 className="cs-cta-heading">Want to see the code?</h2>
            <div className="cs-cta-links">
              <a href="https://github.com/alex-bramwell/nosweat" className="cs-cta-button-primary" target="_blank" rel="noopener">
                View on GitHub &uarr;
              </a>
              <a href="https://nosweat.fitness" className="cs-cta-button-secondary" target="_blank" rel="noopener">
                Live demo &rarr;
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
