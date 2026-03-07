import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./CaseStudy.scss";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: "\u2693",
    title: "Multi-tenant Architecture",
    description: "Every gym gets an isolated data silo via Supabase Row-Level Security. One codebase, infinite tenants, zero config per client.",
  },
  {
    icon: "\u2728",
    title: "Branded Storefronts",
    description: "Each tenant gets a fully themed public site with their logo, colours, and hero imagery generated from a single config object.",
  },
  {
    icon: "\uD83D\uDCC5",
    title: "Class Booking Engine",
    description: "Real-time class timetable with capacity tracking, waitlists, cancellation policies, and calendar sync, all optimistically updated.",
  },
  {
    icon: "\uD83D\uDCB3",
    title: "Stripe Payments",
    description: "Subscription billing with Stripe Checkout. Webhooks handle plan changes, failed payments, and invoice generation server-side.",
  },
  {
    icon: "\uD83C\uDFCB\uFE0F",
    title: "WOD Programming",
    description: "Coaches publish daily workouts with movement libraries. Members log scores and track PRs through a personal dashboard.",
  },
  {
    icon: "\uD83D\uDC64",
    title: "Coach Profiles & Roles",
    description: "Role-based access: owners manage billing, coaches publish content, members book classes. All enforced at the RLS layer.",
  },
];

const ARCH_LAYERS = [
  { label: "React 19 + TypeScript", sub: "Component library, hooks, routing", pct: 100 },
  { label: "SCSS Modules", sub: "Token-based theming, responsive grid", pct: 88 },
  { label: "Supabase + RLS", sub: "Auth, Postgres, real-time subscriptions", pct: 92 },
  { label: "Stripe API", sub: "Checkout, webhooks, subscription lifecycle", pct: 75 },
  { label: "Docker + Vercel", sub: "Containerised dev, edge deployment", pct: 82 },
];

const METRICS = [
  { value: 6, suffix: "", label: "Core modules" },
  { value: 18, suffix: "+", label: "Database tables" },
  { value: 100, suffix: "%", label: "Solo-built" },
  { value: 4, suffix: "", label: "User roles" },
];

const PROCESS_STEPS = [
  { phase: "01", title: "Research", detail: "Competitor audit of 12 gym platforms. Mapped core jobs-to-be-done for owners, coaches, and members." },
  { phase: "02", title: "Wireframes", detail: "Low-fi flows in Figma covering onboarding, booking, payments, and admin. Validated with 3 gym owners." },
  { phase: "03", title: "Design System", detail: "Built token-based system: colour, spacing, type scales. Every component documented in Storybook." },
  { phase: "04", title: "Engineering", detail: "React 19 + TypeScript frontend, Supabase backend with RLS, Stripe integration, Docker dev environment." },
  { phase: "05", title: "Ship & Iterate", detail: "Deployed to Vercel edge network. Continuous deployment from main branch with preview URLs per PR." },
];

function CountUpStat({ endValue, suffix, label, isReduced }) {
  const ref = useRef(null);
  const valRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !valRef.current || isReduced) return;
    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: endValue,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      onUpdate: () => {
        if (valRef.current) valRef.current.textContent = Math.round(counter.val) + suffix;
      },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [endValue, suffix, isReduced]);

  return (
    <div className="cs-metric-card" ref={ref}>
      <span className="cs-metric-value" ref={valRef}>{isReduced ? endValue + suffix : "0" + suffix}</span>
      <span className="cs-metric-label">{label}</span>
    </div>
  );
}

export default function CaseStudy({ isOpen, onClose }) {
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

    // --- Architecture bars ---
    document.querySelectorAll(".cs-arch-bar-fill").forEach((bar) => {
      const st = ScrollTrigger.create({
        trigger: bar.parentElement,
        scroller,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(bar,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: "power3.out" }
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
            { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "power3.out", delay: (i % 3) * 0.08 }
          );
        },
      });
      triggersRef.current.push(st);
    });

    // --- Metrics count-up triggers ---
    document.querySelectorAll(".cs-metric-card").forEach((card) => {
      const st = ScrollTrigger.create({
        trigger: card,
        scroller,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
          );
        },
      });
      triggersRef.current.push(st);
    });

    // --- SVG connector draw ---
    document.querySelectorAll(".cs-svg-connector path").forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      const st = ScrollTrigger.create({
        trigger: path.closest(".cs-arch-section"),
        scroller,
        start: "top 60%",
        once: true,
        onEnter: () => {
          gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" });
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
              Multi-tenant SaaS platform for gyms, from Figma wireframes
              to production React, built end-to-end as a solo project.
            </p>
            <div className="cs-hero-chips">
              {["React 19", "TypeScript", "SCSS Modules", "Supabase", "Stripe", "Docker", "Vercel"].map((t) => (
                <span key={t} className="skill-chip cs-hero-chip">{t}</span>
              ))}
            </div>
            <div className="cs-hero-links">
              <a href="https://github.com/alex-bramwell/nosweat" target="_blank" rel="noopener">&uarr; GitHub</a>
              <a href="https://gym-cross-fit-comet.vercel.app" target="_blank" rel="noopener">&rarr; Live demo</a>
            </div>
          </div>
        </div>

        {/* ===== METRICS ===== */}
        <div className="cs-metrics-strip">
          {METRICS.map((m) => (
            <CountUpStat key={m.label} endValue={m.value} suffix={m.suffix} label={m.label} isReduced={isReduced} />
          ))}
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

        {/* ===== ARCHITECTURE ===== */}
        <section className="cs-section cs-arch-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Architecture</span>
            <h2 className="cs-section-heading">Stack &amp; infrastructure</h2>
            <div className="cs-arch-diagram">
              <svg className="cs-svg-connector" viewBox="0 0 600 280" preserveAspectRatio="none">
                <path d="M30 20 Q300 140 570 20" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.3" />
                <path d="M30 80 Q300 200 570 80" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.2" />
                <path d="M30 140 Q300 260 570 140" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.15" />
              </svg>
              {ARCH_LAYERS.map((layer) => (
                <div key={layer.label} className="cs-arch-row">
                  <div className="cs-arch-label">
                    <span className="cs-arch-name">{layer.label}</span>
                    <span className="cs-arch-sub">{layer.sub}</span>
                  </div>
                  <div className="cs-arch-bar">
                    <div
                      className="cs-arch-bar-fill"
                      style={{ "--bar-width": `${layer.pct}%` }}
                    />
                    <span className="cs-arch-pct">{layer.pct}%</span>
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
            <h2 className="cs-section-heading">What it does</h2>
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

        {/* ===== CTA ===== */}
        <section className="cs-section cs-cta-section">
          <div className="cs-section-inner cs-cta-inner">
            <h2 className="cs-cta-heading">Want to see the code?</h2>
            <div className="cs-cta-links">
              <a href="https://github.com/alex-bramwell/nosweat" className="cs-cta-button-primary" target="_blank" rel="noopener">
                View on GitHub &uarr;
              </a>
              <a href="https://gym-cross-fit-comet.vercel.app" className="cs-cta-button-secondary" target="_blank" rel="noopener">
                Live demo &rarr;
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
