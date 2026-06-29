# CLAUDE.md - noSweatFitness

## Project Overview
Multi-tenant SaaS platform for gym websites. Each gym gets a white-label site with customizable branding, features, and content at `/gym/:slug`. The root `/` serves the platform marketing/onboarding site.

## Tech Stack
- **Frontend**: React 19, TypeScript 5.9, Vite 7, SCSS modules, react-router-dom v7
- **Backend**: Supabase (Postgres + Auth + Storage), Vercel serverless functions (`api/`)
- **Payments**: Stripe (day passes, trials, subscriptions, service bookings)
- **Styling**: SCSS modules (`.module.scss`), CSS custom properties for theming
- **Build**: `tsc -b && vite build`, deployed on Vercel

## Git Flow
- **Local-first, ship only on request**: Do work locally and verify it locally (run `npm run lint`, `npm run build`, and drive the affected pages with Playwright/screenshots). Local commits to a branch are fine for checkpointing. Do NOT push, open a PR, or merge to `develop`/`main` until the developer explicitly asks to "go live" / ship - because pushing and merging to `main` deploys to production. Batch up local changes and run the go-live pipeline (push -> PR -> CI -> merge `develop` -> `main`) only when asked. The branching/PR/merge flow below is exactly how to go live once asked; it just is not triggered automatically per change.
- **Branching**: `feature/<name>` or `fix/<name>` -> `develop` -> `main` (two-step promotion)
- **Commit prefixes**: `feat(scope):`, `fix(scope):`, `ci:`, `docs:`, `rebrand:`
- **Merge messages**: `merge: feature/<name> into develop - summary` / `merge: develop into main - summary`
- Explicit merge commits (no squash), full history preserved
- Branch names are kebab-case
- **NEVER reference Claude, AI, or "Co-Authored-By" in commit messages.** Write commits as if the developer wrote them.
- **NEVER use em dashes** in copy, commit messages, or any user-facing text. Use hyphens (-) or rewrite the sentence instead.

## Engineering Conventions (keep tech debt out)
These are enforced by ESLint and the CI workflow (`.github/workflows/ci.yml` runs `npm run lint` + `npm run build` + grep guardrails on every PR). Lint is at 0 errors - keep it there. Follow them when writing code:

- **Backend/frontend boundary**: code in `api/` and `server/` must NEVER import from `src/`. `src/lib/supabase.ts` and other frontend modules use Vite-only `import.meta.env`, which is `undefined` in Node and crashes handlers at runtime. Put shared server code in `api/lib/` or `api/services/`. Use `process.env` (never `import.meta.env`) in backend code.
- **One backend, one source of truth**: `/api` (Vercel functions) is the only backend implementation. Locally, `server/index.ts` is a thin adapter that mounts the real `/api` handlers - do not reimplement endpoints in `server/`.
- **Shared singletons**: import the shared clients/helpers, don't re-instantiate per file: `api/lib/supabase.ts` (service-role Supabase), `api/lib/stripe.ts` (Stripe), `api/lib/stripe-helpers.ts` (`sanitizeMetadata`, `getOrCreateStripeCustomer`), `api/lib/auth.ts` (`verifyAuth`, `assertMethod`). On the frontend use `src/lib/auth.ts` (`authFetch`, `getAccessToken`) and `src/services/*` rather than hand-rolled fetches/queries.
- **No debug logging in committed code**: no `console.log`/`console.debug` in `src/` (`console.warn`/`console.error` for real failures are fine). Backend operational logs are allowed.
- **No dead code / no duplication**: extract repeated logic into `src/services/` or `api/lib/`; remove unused files, exports, and types rather than leaving them. `noUnusedLocals` is on.
- **Keep docs in sync**: when you rename things, remove files, or change counts/commands, update `README.md` and this file in the same change.
- **Production hardening** (see README "Production Hardening & Observability"): new API handlers should `await captureError(err, { endpoint })` (`api/lib/sentry.ts`) in their catch; throttle abuse-prone endpoints with `checkRateLimit()` (`api/lib/rateLimit.ts`); if you add a third-party origin (script/style/connect/frame), update the CSP in `vercel.json`. Error tracking (Sentry) is optional and no-op without `VITE_SENTRY_DSN`/`SENTRY_DSN`.
- **Adding a dependency**: `node_modules` is an anonymous Docker volume that shadows the image, so after editing `package.json` rebuild with `docker-compose up -d --build --renew-anon-volumes` or the container won't see the new package.

## Dev vs Prod Workflow
- **Local dev** = Docker Compose + local Supabase (NOT `vercel dev`):
  1. `npm run db:start` (local Supabase: API :54321, DB :54322, Studio :54323).
  2. `docker-compose up` (frontend Vite :5173 + backend Express :3001, both load `.env.local`). The backend reaches local Supabase via `host.docker.internal` (set in `docker-compose.yml`).
- **Prod** = Vercel (auto-deploys frontend + `api/` functions on push to `main`); `docker-compose.prod.yml` is a self-host alternative. One multi-stage `Dockerfile` with `dev` / `web` / `api` targets serves both.
- **Database sync** (schema is carried by migrations; data by scripts):
  - `npm run db:pull` - copy prod data + storage into local (safe, only writes local).
  - `npm run db:push-data` - push local data to prod (DESTRUCTIVE; types `PROD` to confirm, backs up prod first, app tables only).
  - Prod creds for these live in `.env.local` (`SUPABASE_DB_PASSWORD`, `SUPABASE_PROD_SERVICE_KEY`).

## Docker (Local Dev)
- Dependencies run via Docker - use `docker-compose` commands, not bare `npm install`/`npm run dev`
- `docker-compose up` - dev: frontend (Vite :5173) + backend (Express :3001), volumes mount `.:/app`
- `docker-compose -f docker-compose.prod.yml up` - prod: nginx :8080 + Express :3001
- Node 20 Alpine base, env from `.env.local` (dev) / `.env` (prod)
- npm scripts: `docker:dev`, `docker:dev:build`, `docker:dev:down`, `docker:prod`, `docker:prod:build`, `docker:prod:down`

## CI/CD - Automated Deployment
- **Vercel**: Auto-deploys frontend + `api/` serverless functions on push to `main`. SPA rewrites all non-`/api` routes to `index.html`.
- **Supabase migrations**: GitHub Action auto-runs `supabase db push --include-all` on push to `main` when `supabase/migrations/**` changes.
- **Database changes**: For ANY database changes (new tables, columns, RLS, seeds, etc.), directly create a new numbered migration SQL file in `supabase/migrations/` using the Write tool. NEVER ask the user to copy-paste SQL or run manual commands - just write the file, commit, and merge to main. CI handles the rest.
- **Env vars**: Stripe secrets and Supabase service keys live in Vercel project settings (not committed). Local dev uses `.env.local`.

## Architecture

### Routing (App.tsx)
Two top-level shells:
1. **GymShell** (`/gym/:slug/*`) - tenant site with Layout (Navbar+Footer), AuthProvider, RegistrationProvider
2. **PlatformShell** (`/*`) - SaaS marketing/onboarding site with PlatformLayout

**Gym routes**: `/` (Home), `/schedule` (gated: class_booking), `/coaches` (gated: coach_profiles), `/about`, `/dashboard` (protected), `/gym-admin` (admin), `/site-builder` (admin, no Layout), `/coach-dashboard` (admin), `/coach-view` (coach)

**Platform routes**: `/`, `/login`, `/signup`, `/onboarding`, `/dashboard`, `/guide`, `/docs`, `/roadmap`, `/subscribe`

### Multi-Tenancy (TenantContext.tsx)
- Slug resolved from URL path `/gym/:slug` or `?tenant=` query param
- Fetches from Supabase: gym, gym_branding, gym_features, gym_programs, gym_schedule, gym_stats, gym_memberships
- `useTenant()` provides all tenant data; `useFeature(key)` checks feature flags; `useGymPath()` builds tenant-prefixed paths

### Custom Domains
- Gyms can use their own domain (e.g., www.mygym.com) as a paid feature (`custom_domain`)
- `useDomainResolution()` hook resolves hostname before React Router mounts
- Two app shells: `CustomDomainApp` (root paths) vs `StandardApp` (path-based `/gym/:slug`)
- `isCustomDomain` flag in TenantContext; `useGymPath()` returns root-relative paths when on custom domain
- API: `api/domains/` (add, verify, remove, resolve) backed by Vercel Domains API
- DB: `gyms.custom_domain`, `custom_domain_status` (none/pending/verified/failed), `custom_domain_verified_at`

### Feature System
Feature keys: `class_booking`, `wod_programming`, `coach_profiles`, `day_passes`, `trial_memberships`, `service_booking`, `coach_analytics`, `member_management`, `custom_domain`
- Stored in `gym_features` table, gated with `<FeatureGate>` component and `useFeature()` hook

### Contexts
- **TenantContext** - gym data, branding, features, programs, schedule, stats, memberships
- **AuthContext** - Supabase auth, user profile with role (admin/coach/staff/member)
- **RegistrationContext** - day-pass/trial registration flow state (sessionStorage, 30min expiry)
- **BrandingOverrideContext** - live branding overrides in site builder
- **ViewAsContext** - role preview in site builder

### Database (Supabase)
Key tables: profiles, gyms, gym_branding, gym_features, gym_programs, gym_schedule, gym_stats, gym_memberships, workouts, crossfit_movements, workout_bookings, bookings, payments, trial_memberships, stripe_customers, coach_services, service_bookings

### API (Vercel Serverless - `api/`)
- `api/lib/supabase.ts` - shared Supabase service client (all endpoints import from here)
- `api/lib/auth.ts` - shared `verifyAuth(req, res)` and `assertMethod(req, res, method)` helpers
- `api/payments/` - create-payment-intent, create-setup-intent, create-service-payment-intent, refund-service-booking
- `api/webhooks/stripe` - Stripe webhook handler
- `api/subscriptions/` - create-checkout-session, session-status, create-gym-subscription
- `api/domains/` - add, verify, remove, resolve (custom domain management)
- `api/connect/` - Stripe Connect account management

### Shared Utilities
- `src/lib/auth.ts` - `getAccessToken()` and `authFetch(url, body)` for authenticated API calls. All frontend components should use these instead of manually constructing fetch calls with auth headers.
- `src/hooks/useMessage.ts` - `useMessage()` hook for success/error toast state with auto-dismiss. Returns `{ message, showSuccess, showError, clear }`.

### Key Component Areas
- `src/components/sections/` - Hero, Programs, WOD, CTA, Stats (homepage sections)
- `src/components/common/` - Button, Card, Modal, Section, Container, FeatureGate, GlassCard, AnimatedSection, EmptyStatePreview, StatusBadge, DetailGrid, SelectableCard, InfoBox
- `src/components/GymAdmin/` - BrandingEditor, GymSettings, CustomDomainPanel, ImageUpload, LockedFeatureOverlay
- `src/components/BuilderSidebar/` - Site builder sidebar
- `src/components/WODEditor/` - Workout programming editor (WODEditor, WODEditorEnhanced, MovementBuilder)
- `src/components/CoachAnalytics/` - Radar, modality, time domain, heavy day charts

## Design System

### Theming - TWO CONTEXTS
**IMPORTANT**: There are two completely separate visual contexts in this app. Always be aware of which one you are working in:

1. **Platform site** (`/*` routes via `PlatformShell`/`PlatformLayout`) - The SaaS marketing/onboarding site. Uses its own dark theme with SCSS variables (`$platform-bg`, `$platform-surface`, `$platform-accent`, etc.) defined in `PlatformLayout.module.scss` and `PlatformHome.module.scss`. CSS custom properties are overridden on `.platformLayout` to dark values so common components (Modal, Button) render correctly in the dark platform theme.

2. **Gym site** (`/gym/:slug/*` routes via `GymShell`/Layout) - Tenant sites with per-gym branding. Uses CSS custom properties (`--color-*`) that are overridden at runtime by `useTenantTheme()` injecting into `:root`. Each gym has its own colors, fonts, etc.

**The default CSS variables in `_variables.scss` are LIGHT theme** (white surface, dark text). Gym sites override these per-tenant. The platform site overrides them in `PlatformLayout.module.scss` to dark values. Any common component (Modal, Button, Card, etc.) that uses `var(--color-*)` will render differently depending on which context it appears in. When building shared components or modals, always use CSS custom properties (`var(--color-*)`) - never hardcode colors - so they adapt to both contexts.

- Every color has an `-rgb` variant for `rgba()` usage: `rgba(var(--color-accent-rgb), 0.5)`
- `data-theme` attribute on `<html>` for light/dark mode
- Google Fonts loaded dynamically: Inter, Poppins, Open Sans, Roboto, Montserrat, Lato, Oswald, Raleway, Playfair Display, Merriweather

### Color Tokens
- `--color-bg`, `--color-bg-light`, `--color-bg-dark` - background layers
- `--color-surface` - card/panel backgrounds
- `--color-accent`, `--color-accent2` - primary brand (used in gradients together)
- `--color-secondary`, `--color-secondary2` - secondary brand
- `--color-specialty` - special accent
- `--color-text`, `--color-muted`, `--color-header`, `--color-footer` - typography colors

### Visual Style
- **Glassmorphism** aesthetic: backdrop-filter blur, translucent surfaces, gradient borders
- **Gradient borders** on navbar, footer, hoverable cards - animated "glisten" effect via `background-size: 200%` + keyframe animation
- **Hover lift**: `translateY(-2px)` to `translateY(-6px)` on interactive elements
- **Buttons**: pill-shaped (`border-radius: 2rem`), gradient backgrounds (`accent` -> `accent2`), subtle pulse animation on primary
- **Cards**: subtle gradient backgrounds (`surface` -> `bg-light`), animated gradient border on hover
- **Modals**: dark blurred overlay (0.85 opacity + blur 6px), slide-up entrance animation
- **Hero**: background image with overlay, optional comet or gradient animation effect
- **Animations**: fadeInUp, fadeInDown, fadeInScale, slideInRight, modalEntrance, glassShimmer, softPulse, float

### Glass Mixins (`src/styles/_mixins.scss`)
- `@include glass` - standard translucent surface with backdrop blur
- `@include glass-elevated` - heavier blur + stronger shadow
- `@include glass-dense` - more opaque for text readability
- `@include gradient-border` - mask-based animated border
- `@include hover-lift` - spring-eased Y translate on hover
- `@include gradient-text` - clipped gradient on text
- `@include ambient-orbs` - blurred radial gradient pseudo-elements

### Component Library (`src/components/common/`)
- **Button**: variants=`primary`|`secondary`|`outline`|`ghost`, sizes=`small`|`medium`|`large`, `fullWidth`, can render as `<a>`
- **Card**: variants=`default`|`elevated`|`bordered`, padding=`none`|`small`|`medium`|`large`, `hoverable`
- **Section**: spacing=`none`|`small`|`medium`|`large`|`xlarge`, background=`default`|`surface`|`dark`
- **Container**: max-width 1280px wrapper
- **Modal**: sizes=`small`|`medium`|`large`|`fullscreen`, Escape to close, overlay click to close
- **GlassCard**: blur=`light`|`medium`|`heavy`, tint=`neutral`|`accent`|`secondary`, `hoverable`, `glow`
- **EmptyStatePreview**: wrapper for sample data in builder mode
- **FeatureGate**: conditionally renders based on gym feature flags
- **StatusBadge**: pill badge with variants=`default`|`warning`|`success`|`error`
- **DetailGrid**: horizontal label/value pairs with optional status coloring (`enabled`|`disabled`|`muted`)
- **SelectableCard**: clickable option card with icon, title, description (keyboard accessible)
- **InfoBox**: styled content block for instructions/tips, variants=`default`|`accent`

### SCSS Patterns
- SCSS modules (`.module.scss`) for component-scoped styles
- `@use '../styles/variables' as *` to import shared variables/mixins
- Container queries (`@container`) used alongside media queries
- Breakpoints: xs(320), sm(480), md(768), lg(1024), xl(1280), xxl(1600)
- Transitions: 0.2s-0.4s ease for most interactions
- **Semantic class naming convention** (ALWAYS follow this):
  - Class names MUST describe what the element IS, not how it looks
  - Good: `.heroHeadline`, `.scheduleGrid`, `.memberAvatar`, `.pricingCard`
  - Bad: `.padding-small`, `.bg-dark`, `.blur-heavy`, `.small`, `.large`
  - For variant/modifier classes on common components, use descriptive names:
    - Size variants: `.sizeCompact`, `.sizeDefault`, `.sizeProminent` (not `.small`, `.medium`, `.large`)
    - Spacing variants: `.spacingTight`, `.spacingNormal`, `.spacingRelaxed`, `.spacingGenerous` (not `.spacing-small`, `.spacing-medium`)
    - Background variants: `.bgDefault`, `.bgSurface`, `.bgBold` (not `.bg-default`, `.bg-surface`, `.bg-dark`)
    - Card variants: `.cardFlat`, `.cardRaised`, `.cardOutlined` (not `.default`, `.elevated`, `.bordered`)
    - Padding variants: `.paddingNone`, `.paddingCompact`, `.paddingNormal`, `.paddingSpacious` (not `.padding-none`, `.padding-small`)
  - Use camelCase for multi-word class names (SCSS modules convention)
  - Keep names human-readable and self-documenting

## Application Workflow

### Public User Journey
1. **Landing** -> Hero with Day Pass / Free Trial / Schedule action cards
2. **Day Pass flow**: "Book Day Pass" -> DayPassModal -> Sign in if needed -> Select class on Schedule -> Stripe payment -> Booking confirmation
3. **Trial flow**: "Book Trial" -> TrialModal -> Sign up/in -> Stripe setup intent (card on file) -> Class selection -> Confirmation
4. **Browse**: Programs section, WOD (today's workout), Stats, About page, Coaches page, Schedule

### Registration Intent System
- `RegistrationContext` tracks user intent (day-pass or trial) across auth flow
- Persisted in `sessionStorage` per gym slug, expires after 30 minutes
- Steps: intent -> auth -> payment -> class-selection -> complete

### Auth Flow
- Supabase Auth with email/password
- AuthModal handles: login, signup, reset password, change password
- Password recovery via Supabase magic link -> `PasswordRecoveryRedirect` intercepts hash params
- Session timeout: 30 min with 5 min warning (SessionWarning component)

### Role-Based Views
- **Public**: gym site, Hero CTAs, browsing
- **Member**: + Dashboard with bookings, profile settings
- **Coach**: + Coach View with WOD viewing
- **Staff**: + Coach View access
- **Admin**: + Gym Admin panel, Coach Dashboard (WOD editor + analytics), Site Builder sidebar

### Admin Builder
- **Site Builder** (`/site-builder`): Full-screen with BuilderSidebar + live preview of pages
- **Layout inline sidebar**: When admin is on normal pages, BuilderSidebar appears alongside the site
- Both use `BrandingOverrideContext` + `useBrandingWithOverrides()` for live preview without saving
- `ViewAsContext` lets admin preview as different roles

### Navbar
- Two styles: `floating` (rounded, padded, gradient border) or `standard` (full-width, flat)
- Sticky, backdrop blur, animated gradient border
- Desktop: Logo + Menu dropdown + User dropdown (or Sign In)
- Mobile: Hamburger -> full-screen overlay menu
- Nav links feature-gated (Schedule needs class_booking, Coaches needs coach_profiles)

### Homepage Sections (Home.tsx)
1. Hero (if `visible_sections.hero`)
2. Programs (if `visible_sections.programs`)
3. WOD - gated by `wod_programming` feature
4. CTA - gated by `class_booking` feature
5. Stats (shows if stats data exists)
