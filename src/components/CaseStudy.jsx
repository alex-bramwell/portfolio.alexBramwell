import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import "./CaseStudy.scss";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

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

const ENGINEERING = [
  {
    title: "Isolation in the database, not the app",
    text: "Row-Level Security policies live in Postgres, so a forgotten WHERE clause can never leak one gym's data to another. The boundary holds even if the app layer has a bug.",
  },
  {
    title: "Realtime, optimistic timetable",
    text: "Supabase subscriptions push booking changes to every open device at once. The UI updates optimistically and reconciles against the server, so it feels instant without going stale.",
  },
  {
    title: "Stripe webhooks as the source of truth",
    text: "Subscription state, failed payments, and plan changes are resolved server-side from webhooks, never trusted from the client. Money state stays correct even if a browser closes mid-flow.",
  },
];

function ArchDiagram() {
  return (
    <svg className="cs-arch-svg" viewBox="0 0 760 470" role="img"
      aria-label="One React codebase routed through a Supabase row-level-security gateway into isolated per-gym data silos, with Stripe attached to the gateway">
      {/* connectors (animated draw-on) */}
      <path className="cs-arch-link" d="M380 96 L380 168" />
      <path className="cs-arch-link" d="M380 240 C380 300 170 300 170 352" />
      <path className="cs-arch-link" d="M380 240 L380 352" />
      <path className="cs-arch-link" d="M380 240 C380 300 590 300 590 352" />
      <path className="cs-arch-link cs-arch-link-side" d="M590 205 L606 205" />

      {/* client */}
      <g className="cs-arch-node">
        <rect x="270" y="32" width="220" height="64" rx="10" />
        <text className="cs-arch-node-title" x="380" y="60" textAnchor="middle">One React codebase</text>
        <text className="cs-arch-node-sub" x="380" y="80" textAnchor="middle">REACT 19 · TYPESCRIPT</text>
      </g>

      {/* RLS gateway (accented, the key layer) */}
      <g className="cs-arch-node cs-arch-node-accent">
        <rect x="170" y="170" width="420" height="70" rx="10" />
        <text className="cs-arch-node-title" x="380" y="201" textAnchor="middle">Supabase · Row-Level Security</text>
        <text className="cs-arch-node-sub" x="380" y="221" textAnchor="middle">EVERY QUERY SCOPED TO A TENANT</text>
      </g>

      {/* stripe */}
      <g className="cs-arch-node">
        <rect x="606" y="176" width="126" height="58" rx="10" />
        <text className="cs-arch-node-title cs-arch-node-title-sm" x="669" y="201" textAnchor="middle">Stripe</text>
        <text className="cs-arch-node-sub" x="669" y="219" textAnchor="middle">WEBHOOKS</text>
      </g>

      {/* tenants */}
      {[
        { x: 95, cx: 170, label: "Gym A" },
        { x: 305, cx: 380, label: "Gym B" },
        { x: 515, cx: 590, label: "Gym C" },
      ].map((t) => (
        <g className="cs-arch-node cs-arch-tenant" key={t.label}>
          <rect x={t.x} y="352" width="150" height="84" rx="10" />
          <text className="cs-arch-node-title cs-arch-node-title-sm" x={t.cx} y="388" textAnchor="middle">{t.label}</text>
          <text className="cs-arch-node-sub" x={t.cx} y="408" textAnchor="middle">ISOLATED SILO</text>
        </g>
      ))}
      <text className="cs-arch-infinity" x="685" y="400" textAnchor="middle">× &#8734;</text>
    </svg>
  );
}

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
  { phase: "01", title: "Research", detail: "Audited the incumbent stack (BoxMate, GoTeamUp, Wodify) and the placeholder-website pattern. Mapped the jobs-to-be-done for owners, coaches, and members.", link: { modal: "research", label: "View the research" } },
  { phase: "02", title: "Wireframes", detail: "Low-fi flows in Balsamiq covering discovery, onboarding, booking, payments, and admin. Validated the booking journey against the friction in existing tools.", link: { href: "https://balsamiq.cloud/sdm033s/pdth810", label: "View the wireframes" } },
  { phase: "03", title: "Design System", detail: "Built a token-based system: colour, spacing, type scales, so every tenant can be rebranded from config. Components documented in Storybook.", links: [{ href: "FIGMA_URL", label: "Open the Figma" }, { href: "STORYBOOK_URL", label: "Browse the Storybook" }] },
  { phase: "04", title: "Engineering", detail: "React 19 + TypeScript frontend, Supabase backend with RLS, Stripe integration, Docker dev environment.", links: [{ modal: "stack", label: "Stack & why" }, { modal: "sitemap", label: "View the sitemap" }, { modal: "ai", label: "AI dev guardrails" }] },
  { phase: "05", title: "Ship & Iterate", detail: "Deployed to Vercel edge with continuous deployment from main and preview URLs per PR.", info: "In plain terms: every time approved work lands on the main branch, the live site updates itself automatically, with no manual upload. And every proposed change gets its own private preview link first, so it can be checked in isolation before it ever reaches the real site.", links: [{ modal: "cicd", label: "The CI/CD pipeline" }] },
];

// --- Research dossier (opened from Process step 01) ---
const AUDIT = [
  {
    tool: "BoxMate",
    pricing: "Per-member monthly fee",
    branding: "Generic app, the gym's name buried inside someone else's product",
    booking: "Members pushed to a separate portal to book and pay",
    gap: "The gym never owns the experience or the data",
  },
  {
    tool: "GoTeamUp",
    pricing: "Per-member monthly fee",
    branding: "Off-brand member portal on a shared subdomain",
    booking: "Booking and payments live away from the gym's own site",
    gap: "Cost scales worst for the smallest gyms",
  },
  {
    tool: "Wodify",
    pricing: "Per-member monthly fee",
    branding: "Generic app, heavy WOD-programming focus",
    booking: "Capable but complex, more than a small box needs",
    gap: "Overbuilt and still off-brand",
  },
  {
    tool: "Placeholder website",
    pricing: "Cheap or free",
    branding: "On-brand, but static",
    booking: "None, every transaction happens elsewhere",
    gap: "Ranks poorly, converts nobody",
  },
];

const MOODS = {
  4: { label: "Keen", color: "#7ed957" },
  3: { label: "Unsure", color: "#e8c547" },
  2: { label: "Friction", color: "#f0883e" },
  1: { label: "Lost", color: "#f25f5c" },
};

const JOURNEY = [
  { stage: "Discover", mood: 4, doing: "Finds the gym on Google or Instagram and lands on a static placeholder site.", pain: "Looks tidy but does nothing, no way to act on the interest." },
  { stage: "Decide", mood: 3, doing: "Wants to try a class and looks for a schedule and a way to book.", pain: "Booking lives somewhere else entirely." },
  { stage: "Book", mood: 2, doing: "Gets bounced to a BoxMate or GoTeamUp portal and is told to make an account.", pain: "Leaves the brand, hits a generic login wall." },
  { stage: "Pay", mood: 2, doing: "Enters card details inside a third-party app.", pain: "Pays someone other than the gym, off-brand and impersonal." },
  { stage: "Return", mood: 1, doing: "Is asked to download an app with another company's name on it.", pain: "Yet another app, and the gym is now invisible." },
];

const INSIGHTS = [
  "Members are handed off at the exact moment they commit. The gym's brand earns the lead, then a third-party portal closes the sale.",
  "Pricing scales with members while ownership of the relationship stays at zero. The gyms growing fastest pay the most to look the least like themselves.",
];

const JOBS = [
  {
    persona: "Owner",
    job: "When I run my gym, I want to look professional and capture leads on my own domain, so I grow without paying a fee that climbs with every member I sign.",
    pains: ["Per-member tax", "Brand split across five tools", "No ownership of member data"],
  },
  {
    persona: "Coach",
    job: "When I program and run classes, I want members to find and book them without friction, so I spend my time coaching, not chasing admin.",
    pains: ["Schedule lives in a separate app", "Manual chasing of bookings", "Tools built for admins, not coaches"],
  },
  {
    persona: "Member",
    job: "When I want to train, I want to book and pay on my gym's own site, so I am not bounced to a generic third-party app with someone else's name on it.",
    pains: ["Yet another app to download", "Off-brand, impersonal portal", "Friction between deciding and booking"],
  },
];

// --- Sitemap (opened from Process step 04) ---
const SITEMAP = [
  {
    area: "Public site",
    note: "Per tenant, fully branded",
    pages: [
      { label: "Home" },
      { label: "Classes & schedule" },
      { label: "Memberships & pricing" },
      { label: "Coaches" },
      { label: "About" },
      { label: "Contact" },
      { label: "Join / sign up" },
    ],
  },
  {
    area: "Member area",
    note: "Authenticated",
    pages: [
      { label: "Dashboard" },
      { label: "Book a class" },
      { label: "My bookings", children: ["Upcoming", "Waitlist", "History"] },
      { label: "Membership & billing" },
      { label: "Profile & settings" },
    ],
  },
  {
    area: "Owner admin",
    note: "Tenant management",
    pages: [
      { label: "Setup dashboard" },
      { label: "Site builder", children: ["Brand & colours", "Content", "Domain"] },
      { label: "Classes", children: ["Schedule", "Capacity & waitlists"] },
      { label: "Members" },
      { label: "Coaches" },
      { label: "Payments", children: ["Stripe Connect", "Transactions", "Payouts"] },
      { label: "Settings" },
    ],
  },
  {
    area: "Auth & system",
    note: "Shared",
    pages: [
      { label: "Log in" },
      { label: "Sign up" },
      { label: "Password reset" },
      { label: "Onboarding" },
      { label: "404 / error" },
    ],
  },
];

const STACK = [
  {
    side: "Frontend",
    tech: ["React 19", "TypeScript 5.9", "Vite 7", "SCSS modules", "React Router 7"],
    why: "React with TypeScript gives a component model and type safety that scale across a large multi-tenant app, catching whole classes of error at build time instead of in production. Vite keeps the dev loop fast with instant hot reload and quick builds. SCSS modules scope every style and lean on CSS custom properties, which is what lets each gym be rebranded at runtime without touching code. React Router handles the nested two-shell routing that separates the platform site from the tenant sites.",
  },
  {
    side: "Backend",
    tech: ["Supabase", "Postgres", "Vercel functions", "Stripe"],
    why: "Supabase bundles Postgres, Auth, and Storage so I am not rebuilding plumbing, and its row-level security is what makes multi-tenancy both safe and cheap: every query is scoped to a tenant at the database, not in app code. Vercel serverless functions sit next to the frontend with no server to manage and scale on demand. Stripe handles payments and, through Connect, routes money straight to each gym's own bank account rather than pooling it.",
  },
];

const INFRA = [
  {
    name: "Why Supabase",
    points: [
      "Postgres, Auth, and Storage in one managed service, so there is no separate auth provider or file host to wire up.",
      "Row-level security enforces multi-tenancy in the database itself: every query is scoped to a tenant by policy, so an app-layer bug cannot leak one gym's data to another.",
      "It is real Postgres, which means standard SQL, proper migrations, and no lock-in to a proprietary query language.",
      "Realtime subscriptions are built in, and the whole stack runs locally through the Supabase CLI, so dev matches prod.",
    ],
  },
  {
    name: "Why Vercel",
    points: [
      "Zero-ops deploys: a push to main ships the frontend and the api functions automatically, with no servers to provision or patch.",
      "Serverless functions scale to zero and back on demand, so the bill tracks real usage, which suits a young product.",
      "A preview deployment per pull request gives every change its own live URL to review before it goes live.",
      "An edge CDN serves the frontend fast worldwide, and the Domains API is what powers each gym's custom domain.",
    ],
  },
];

const AI_GUARDRAILS = [
  {
    title: "Ship only on command",
    summary: "The assistant works and verifies locally and never deploys on its own. Nothing reaches production until I say go live.",
    rules: ["Local-first: lint, build, and screenshot before anything", "No push, PR, or merge to main without my say-so", "Production deploys stay a deliberate, human step"],
  },
  {
    title: "Guardrails against tech debt",
    summary: "Boundaries enforced by ESLint and CI on every change, so AI-written code stays as clean as hand-written code.",
    rules: ["Strict backend and frontend import boundary", "Reuse shared singletons, never re-instantiate clients", "No debug logging, dead code, or duplication committed"],
  },
  {
    title: "Git guardrails",
    summary: "A defined branching and commit discipline so the history stays clean, traceable, and indistinguishable from mine.",
    rules: ["Two-step promotion: feature or fix to develop to main", "Conventional prefixes and explicit merge commits, never squash", "No Claude, AI, or Co-Authored-By references in commits"],
  },
  {
    title: "Respect the architecture",
    summary: "The assistant works inside the multi-tenant structure I designed instead of inventing parallel patterns beside it.",
    rules: ["One backend source of truth in the api directory", "Feature gating through the existing flag system", "Tenant data flows through the established contexts"],
  },
  {
    title: "Two visual contexts, always",
    summary: "The app has a dark platform site and per-gym branded sites, so the assistant must know which one it is touching.",
    rules: ["Always use CSS custom properties, never hardcoded colour", "Shared components must adapt to both themes", "Per-tenant branding injected at runtime stays intact"],
  },
  {
    title: "Naming and database discipline",
    summary: "Conventions that keep the codebase legible and database changes safe and traceable.",
    rules: ["Semantic class names: what it is, not how it looks", "Numbered migration files written directly, never manual SQL", "Docs updated in the same change as the code"],
  },
];

const PIPELINE = [
  { stage: "Open a PR", tag: "CI", desc: "Push a feature or fix branch and open a pull request. Nothing reaches the live site yet." },
  { stage: "Preview URL", tag: "CD", desc: "Vercel spins up a private preview deploy for that PR, a live link to test the change in isolation." },
  { stage: "Automated checks", tag: "CI", desc: "GitHub Actions runs lint, build, and guardrail greps on the PR. Zero errors are required, or it cannot merge." },
  { stage: "Merge & promote", tag: "Gate", desc: "Approved work merges to develop, then main, with explicit merge commits so the history stays readable." },
  { stage: "Auto-deploy", tag: "CD", desc: "Landing on main deploys the frontend and api functions to Vercel, and Supabase migrations run automatically." },
  { stage: "Live & iterate", tag: "CD", desc: "The site updates itself with no manual upload, then the loop begins again on the next change." },
];

const OUTCOMES = [
  { stat: "5 → 1", label: "tools collapsed into the gym's own website" },
  { stat: "£0", label: "per-member fees, replaced by a flat multi-tenant model" },
  { stat: "1 domain", label: "for discovery, booking, and payments, all on-brand" },
];

const SCREENS = [
  { src: "case-study/site-builder.jpg", title: "Site builder", caption: "Colour, type, and content edited live, no code. Every tenant rebrands from one config object." },
  { src: "case-study/schedule.jpg", title: "Class schedule", caption: "Booking, waitlists, and capacity on the gym's own domain, never a third-party portal." },
  { src: "case-study/dashboard.png", title: "Owner dashboard", caption: "A guided setup: logo, brand colours, classes, payments, coaches, and members." },
  { src: "case-study/payments.png", title: "Payments", caption: "Member payments flow straight to the gym's bank account through Stripe." },
];

const ROADMAP = [
  {
    status: "In development",
    items: [
      { title: "Workout tracking & PR logging", text: "Members log weights, times, and reps, with personal records and progress tracked automatically." },
      { title: "Automated email & SMS", text: "Booking reminders, waitlist updates, and class changes sent without anyone lifting a finger." },
      { title: "Billing & membership tiers", text: "Recurring subscriptions with multiple levels and clean upgrade, downgrade, and cancel flows." },
    ],
  },
  {
    status: "Planned",
    items: [
      { title: "QR code check-in", text: "Members scan on arrival, so attendance tracks itself." },
      { title: "Challenges & leaderboards", text: "Gym-wide competitions, monthly challenges, and a bit of community rivalry." },
      { title: "Custom forms", text: "Waivers, health questionnaires, and onboarding forms with digital signatures." },
    ],
  },
  {
    status: "Under consideration",
    items: [
      { title: "Shop loyalty points", text: "Earn and redeem points on in-gym shop purchases." },
      { title: "Member referrals", text: "Reward members who bring new signups, with configurable incentives." },
      { title: "Wearable integration", text: "Pull heart rate and workout data from Apple Watch, Fitbit, and Garmin." },
      { title: "Merchandise store", text: "Sell branded gear and supplements through the gym site with integrated checkout." },
      { title: "Community wall", text: "Member posts, photos, and achievement sharing inside the platform." },
    ],
  },
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

function ResearchModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cs-research-overlay" onClick={onClose}>
      <div className="cs-research-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Research dossier">
        <button className="cs-research-close" onClick={onClose} aria-label="Close research">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="cs-research-eyebrow">Research / 01</span>
        <h2 className="cs-research-title">Audit &amp; jobs-to-be-done</h2>

        <h3 className="cs-research-subhead">Competitive audit</h3>
        <p className="cs-research-lead">
          Every incumbent charges a per-member fee and pulls booking off-brand. The placeholder website keeps the brand but does no work.
        </p>
        <div className="cs-audit-table">
          <div className="cs-audit-row cs-audit-head">
            <span>Tool</span>
            <span>Pricing</span>
            <span>Branding</span>
            <span>Booking</span>
            <span>Core gap</span>
          </div>
          {AUDIT.map((row) => (
            <div className="cs-audit-row" key={row.tool}>
              <span className="cs-audit-tool">{row.tool}</span>
              <span>{row.pricing}</span>
              <span>{row.branding}</span>
              <span>{row.booking}</span>
              <span className="cs-audit-gap">{row.gap}</span>
            </div>
          ))}
        </div>

        <h3 className="cs-research-subhead">Member journey, today</h3>
        <p className="cs-research-lead">
          What it actually feels like to become a member with the incumbent stack. Confidence drops at every step the gym hands off.
        </p>
        <div className="cs-journey">
          {JOURNEY.map((s, i) => (
            <div
              className="cs-journey-stage"
              key={s.stage}
              style={{
                backgroundColor: `color-mix(in srgb, ${MOODS[s.mood].color} 8%, var(--color-background))`,
                borderColor: `color-mix(in srgb, ${MOODS[s.mood].color} 30%, var(--color-border))`,
              }}
            >
              <span className="cs-journey-stage-name">{i + 1}. {s.stage}</span>
              <p className="cs-journey-doing">{s.doing}</p>
              <span className="cs-journey-mood" style={{ backgroundColor: MOODS[s.mood].color }}>{MOODS[s.mood].label}</span>
              <p className="cs-journey-pain">{s.pain}</p>
            </div>
          ))}
        </div>

        <h3 className="cs-research-subhead">What the research told us</h3>
        <div className="cs-insights">
          {INSIGHTS.map((text, i) => (
            <div className="cs-insight" key={i}>
              <span className="cs-insight-num">0{i + 1}</span>
              <p className="cs-insight-text">{text}</p>
            </div>
          ))}
        </div>

        <h3 className="cs-research-subhead">Jobs-to-be-done</h3>
        <div className="cs-jobs-grid">
          {JOBS.map((job) => (
            <div className="cs-job-card" key={job.persona}>
              <span className="cs-job-persona">{job.persona}</span>
              <p className="cs-job-statement">{job.job}</p>
              <ul className="cs-job-pains">
                {job.pains.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SitemapModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cs-research-overlay" onClick={onClose}>
      <div className="cs-research-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Sitemap">
        <button className="cs-research-close" onClick={onClose} aria-label="Close sitemap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="cs-research-eyebrow">Engineering / 04</span>
        <h2 className="cs-research-title">Full sitemap</h2>
        <p className="cs-research-lead">
          Every route in the platform, grouped by who it serves. One codebase renders all of it, scoped to a tenant by row-level security.
        </p>

        <div className="cs-sitemap">
          {SITEMAP.map((area) => (
            <div className="cs-sitemap-area" key={area.area}>
              <span className="cs-sitemap-area-title">{area.area}</span>
              <span className="cs-sitemap-area-note">{area.note}</span>
              <ul className="cs-sitemap-list">
                {area.pages.map((p) => (
                  <li key={p.label}>
                    {p.label}
                    {p.children && (
                      <ul className="cs-sitemap-sublist">
                        {p.children.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cs-research-overlay" onClick={onClose}>
      <div className="cs-research-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Stack choices">
        <button className="cs-research-close" onClick={onClose} aria-label="Close stack choices">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="cs-research-eyebrow">Engineering / 04</span>
        <h2 className="cs-research-title">The stack, and why</h2>
        <p className="cs-research-lead">
          Two halves, each chosen to serve the multi-tenant model: one codebase, many fully branded gyms, at near-zero marginal cost.
        </p>

        <div className="cs-stack">
          {STACK.map((s) => (
            <div className="cs-stack-box" key={s.side}>
              <span className="cs-stack-side">{s.side}</span>
              <div className="cs-stack-tech">
                {s.tech.map((t) => <span className="cs-stack-chip" key={t}>{t}</span>)}
              </div>
              <p className="cs-stack-why">{s.why}</p>
            </div>
          ))}
        </div>

        <h3 className="cs-research-subhead">Why this infrastructure</h3>
        <div className="cs-infra">
          {INFRA.map((i) => (
            <div className="cs-infra-box" key={i.name}>
              <span className="cs-infra-title">{i.name}</span>
              <ul className="cs-infra-points">
                {i.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="cs-stack-note">
          <span className="cs-stack-note-label">A styling opinion</span>
          <p className="cs-stack-note-text">
            I reach for SCSS modules over a utility framework like Tailwind. Class names should say what an element <em>is</em>, not how it looks, so the markup stays readable and the design tokens live in one place instead of scattered across utility strings in the JSX. It is a design-engineering preference: the code reads like the design, and the next person can follow it.
          </p>
          <div className="cs-stack-compare">
            <div className="cs-stack-compare-row">
              <span className="cs-stack-compare-tag">Utility</span>
              <code>{'<div class="flex gap-4 p-6 rounded-xl bg-zinc-900">'}</code>
            </div>
            <div className="cs-stack-compare-row cs-stack-compare-row-good">
              <span className="cs-stack-compare-tag">Semantic</span>
              <code>{'<div class="scheduleGrid">'}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cs-research-overlay" onClick={onClose}>
      <div className="cs-research-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="AI development guardrails">
        <button className="cs-research-close" onClick={onClose} aria-label="Close AI guardrails">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="cs-research-eyebrow">Engineering / 04</span>
        <h2 className="cs-research-title">Tailoring the AI workflow</h2>
        <p className="cs-research-lead">
          I do not just prompt a general model. A <code className="cs-inline-code">CLAUDE.md</code> file at the repo root acts as a project constitution: it narrows a general-purpose assistant down to this codebase's conventions, boundaries, and review gates, so AI help speeds me up without eroding quality or control. These are the rules I set.
        </p>

        <div className="cs-guardrails">
          {AI_GUARDRAILS.map((g) => (
            <div className="cs-guardrail" key={g.title}>
              <h3 className="cs-guardrail-title">{g.title}</h3>
              <p className="cs-guardrail-summary">{g.summary}</p>
              <ul className="cs-guardrail-rules">
                {g.rules.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="cs-ai-download">
          <div className="cs-ai-download-text">
            <h3 className="cs-ai-download-heading">Take the file</h3>
            <p className="cs-ai-download-lead">
              This is the actual <code className="cs-inline-code">CLAUDE.md</code> from the project. It briefs the assistant on what it is working on and the areas it can help with:
            </p>
            <ul className="cs-ai-download-list">
              <li>Project overview and tech stack</li>
              <li>Git flow and commit discipline</li>
              <li>Engineering conventions and tech-debt guardrails</li>
              <li>Dev and prod workflow, Docker, and CI/CD</li>
              <li>Architecture, routing, and multi-tenancy</li>
              <li>Design system, theming, and naming</li>
              <li>Application workflows and user journeys</li>
            </ul>
          </div>
          <a className="cs-ai-download-btn" href={BASE + "nosweat-claude.md"} download="CLAUDE.md">
            Download CLAUDE.md &darr;
          </a>
        </div>

        <p className="cs-ai-download-note">
          <strong>Adapting it to your stack:</strong> this file is tuned to this project's exact setup, React and TypeScript on the frontend, Supabase and Postgres with Vercel serverless functions on the backend, Stripe for payments, and Docker for local dev. If yours differs, treat it as a structure to adapt rather than a drop-in. The principles carry over to any stack, like clear backend and frontend boundaries, semantic naming, writing in your own voice, and ship-on-command. The sections to rewrite for your tools are <em>Tech Stack</em>, the backend boundary in <em>Engineering Conventions</em>, <em>Dev vs Prod Workflow</em>, and <em>CI/CD</em>.
        </p>
      </div>
    </div>
  );
}

function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="cs-infotip">
      <button
        type="button"
        className="cs-infotip-btn"
        aria-label="Explain in simpler terms"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      <span className="cs-infotip-bubble" role="tooltip" data-open={open}>{text}</span>
    </span>
  );
}

function CicdModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cs-research-overlay" onClick={onClose}>
      <div className="cs-research-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="CI/CD pipeline">
        <button className="cs-research-close" onClick={onClose} aria-label="Close pipeline">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="cs-research-eyebrow">Ship &amp; Iterate / 05</span>
        <h2 className="cs-research-title">The CI/CD pipeline</h2>
        <p className="cs-research-lead">
          Two halves working together. <strong>CI</strong> verifies every change before it is allowed to merge; <strong>CD</strong> deploys it automatically once it lands. No manual steps, no broken code reaching the live site.
        </p>

        <div className="cs-pipeline">
          {PIPELINE.map((p, i) => (
            <div className="cs-pipeline-step" key={p.stage}>
              <span className="cs-pipeline-num">{i + 1}</span>
              <div className="cs-pipeline-body">
                <div className="cs-pipeline-head">
                  <h3 className="cs-pipeline-stage">{p.stage}</h3>
                  <span className="cs-pipeline-tag" data-tag={p.tag}>{p.tag}</span>
                </div>
                <p className="cs-pipeline-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudy({ isOpen, onClose, onOpenArticle }) {
  const overlayRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);
  const triggersRef = useRef([]);
  const { isReduced } = useTheme();
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCicdOpen, setIsCicdOpen] = useState(false);

  const openModal = (which) => {
    if (which === "research") setIsResearchOpen(true);
    if (which === "sitemap") setIsSitemapOpen(true);
    if (which === "stack") setIsStackOpen(true);
    if (which === "ai") setIsAiOpen(true);
    if (which === "cicd") setIsCicdOpen(true);
  };

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

    // --- Architecture connector draw-on ---
    document.querySelectorAll(".cs-arch-link").forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      const st = ScrollTrigger.create({
        trigger: ".cs-architecture-section",
        scroller,
        start: "top 60%",
        once: true,
        onEnter: () => {
          gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", delay: 0.1 });
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
      <ResearchModal isOpen={isResearchOpen} onClose={() => setIsResearchOpen(false)} />
      <SitemapModal isOpen={isSitemapOpen} onClose={() => setIsSitemapOpen(false)} />
      <StackModal isOpen={isStackOpen} onClose={() => setIsStackOpen(false)} />
      <AIModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <CicdModal isOpen={isCicdOpen} onClose={() => setIsCicdOpen(false)} />
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

        {/* ===== SHOWCASE ===== */}
        <section className="cs-showcase-section">
          <div className="cs-showcase">
            <figure className="cs-showcase-desktop cs-reveal-card">
              <img src={BASE + "case-study/storefront.jpg"} alt="A gym's branded NoSweat storefront on desktop" loading="lazy" />
            </figure>
            <figure className="cs-showcase-mobile cs-reveal-card" data-delay="0.12">
              <img src={BASE + "case-study/storefront-mobile.jpg"} alt="The same storefront on mobile" loading="lazy" />
            </figure>
          </div>
          <p className="cs-showcase-caption">One branded site, every device, all on the gym's own domain.</p>
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
                    <p className="cs-process-step-detail">
                      {step.detail}
                      {step.info && <InfoTip text={step.info} />}
                    </p>
                    {step.link && step.link.modal && (
                      <button type="button" className="cs-process-step-link" onClick={() => openModal(step.link.modal)}>
                        {step.link.label} &rarr;
                      </button>
                    )}
                    {step.link && step.link.href && (
                      <a className="cs-process-step-link" href={step.link.href} target="_blank" rel="noopener">
                        {step.link.label} &rarr;
                      </a>
                    )}
                    {step.links && (
                      <div className="cs-process-step-links">
                        {step.links.map((l) => (
                          <a key={l.label} className="cs-process-step-link" href={l.href} target="_blank" rel="noopener">
                            {l.label} &rarr;
                          </a>
                        ))}
                      </div>
                    )}
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

        {/* ===== ARCHITECTURE ===== */}
        <section className="cs-section cs-architecture-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Architecture</span>
            <h2 className="cs-section-heading">One codebase, every gym&nbsp;isolated</h2>
            <p className="cs-lead-text">
              Multi-tenancy is what makes the economics work. A single React app
              serves every gym, but each tenant's data is fenced off in Postgres
              at the row level, so the platform scales to any number of gyms at
              near-zero marginal cost.
            </p>
            <div className="cs-arch-diagram cs-reveal-card">
              <ArchDiagram />
            </div>
            <div className="cs-engineering-grid">
              {ENGINEERING.map((e, i) => (
                <div key={e.title} className="cs-engineering-card cs-reveal-card" data-delay={(i % 3) * 0.06}>
                  <h3 className="cs-engineering-title">{e.title}</h3>
                  <p className="cs-engineering-text">{e.text}</p>
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

        {/* ===== SCREENS ===== */}
        <section className="cs-section cs-screens-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Screens</span>
            <h2 className="cs-section-heading">Inside the&nbsp;build</h2>
            <div className="cs-screens-grid">
              {SCREENS.map((s, i) => (
                <figure key={s.src} className="cs-screen-card cs-reveal-card" data-delay={(i % 2) * 0.08}>
                  <div className="cs-screen-frame">
                    <img src={BASE + s.src} alt={s.title} loading="lazy" />
                  </div>
                  <figcaption className="cs-screen-caption">
                    <span className="cs-screen-title">{s.title}</span>
                    <span className="cs-screen-text">{s.caption}</span>
                  </figcaption>
                </figure>
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

        {/* ===== ROADMAP ===== */}
        <section className="cs-section cs-roadmap-section">
          <div className="cs-section-inner">
            <span className="cs-section-eyebrow">Roadmap</span>
            <h2 className="cs-section-heading">Where it goes&nbsp;next</h2>
            <p className="cs-lead-text">
              The platform ships behind a live, member-votable roadmap. Here is
              what is in flight and what is queued, with the gym's own site always
              the place it lands.
            </p>
            <div className="cs-roadmap-grid">
              {ROADMAP.map((col, ci) => (
                <div key={col.status} className="cs-roadmap-group cs-reveal-card" data-delay={ci * 0.08}>
                  <div className={`cs-roadmap-status cs-roadmap-status-${ci}`}>
                    <span className="cs-roadmap-dot" aria-hidden="true" />
                    {col.status}
                  </div>
                  <ul className="cs-roadmap-items">
                    {col.items.map((item) => (
                      <li key={item.title} className="cs-roadmap-item">
                        <span className="cs-roadmap-item-title">{item.title}</span>
                        <span className="cs-roadmap-item-text">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
