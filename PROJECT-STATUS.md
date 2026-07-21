# Visum — Project Status

_Last updated: 2026-07-20_

A living snapshot of where Visum is, what's missing, and what to build next.
Pair this with [IMPROVEMENT-CHECKLIST.md](IMPROVEMENT-CHECKLIST.md) (the
line-item fix list from the 2026-07-19 review).

---

## 1. What Visum is

Visum scans any public website for **AI-agent readiness** — how well AI systems
(ChatGPT, Claude, Perplexity, etc.) can find, read, and cite it — and returns a
**0–100 score** with per-check findings and prioritized fixes in ~20 seconds.

**Architecture**

| Layer | Stack | Hosting |
| --- | --- | --- |
| Frontend | Next.js 16 (Pages Router), React 19, Tailwind v4 | Vercel (`visum-eight.vercel.app`) |
| Backend | FastAPI, Playwright (Chromium), httpx | Render (`visum-xoe3.onrender.com`) |
| Data | Supabase (Postgres) — scan persistence + auth | Supabase Cloud |
| Analytics | PostHog + Vercel Analytics | — |

**The 8 checks:** robots.txt (AI-bot permissions), JSON-LD structured data,
llms.txt, MCP endpoint, JavaScript rendering, meta/Open Graph tags, sitemap.xml,
page load speed.

**Core funnel:** landing → scan a URL → email gate → full result report.

---

## 2. Status at a glance

- ✅ Scanner backend is functional and honest (421 tests passing).
- ✅ Marketing site + scan result experience are polished.
- ✅ Visum dogfoods to **100/100** on its own scanner in production (verified against https://visum-eight.vercel.app — every check maxed).
- ✅ Email/password **authentication** is built (opt-in via Supabase env vars).
- ⚠️ The "product dashboard" (analytics, insights, competitors, etc.) is **sample data**, gated behind "preview" banners — not yet wired to real per-user data.
- ⚠️ Auth exists but the dashboard doesn't yet show a signed-in user's **own** scans.

---

## 3. What we have (done)

### Backend — scanner & scoring
- All 8 checks implemented with honest measurement: when tooling can't measure a
  check (e.g. headless browser unavailable), it reports `measured=False` and is
  **excluded from the total** rather than fabricating a score.
- Scorer normalizes the total over only the measured checks.
- Real, correct scoring: robots.txt absence = "all crawlers allowed" (passes);
  MCP is a right-weighted bonus signal; soft-404 detection in `_fetch`.
- **Security:** `_validate_url` blocks localhost/private/loopback/link-local
  (SSRF); per-IP rate limiting + a concurrency semaphore.
- **CI:** `.github/workflows/ci.yml` runs the backend test suite on every push/PR
  to `main`.
- **Deploy:** `render.yaml` installs Playwright Chromium in the build; health
  check at `/health`.

### Frontend — scanner experience
- Landing page, the scan flow, and a trustworthy result report: unique per-check
  "Why It Matters" copy, severity-consistent impact text, score gains capped to
  points available, a weighted average that matches the headline, and a neutral
  "Not measured" state.
- Marketing pages: about, contact, privacy, terms, pricing.
- Security headers (CSP, X-Frame-Options, etc.) in `next.config.mjs`.
- Own-site AI-readiness artifacts: JSON-LD (`WebSite`/`Organization`/`SoftwareApplication`/`Service`),
  `llms.txt`, `openapi.json`, and a **real MCP endpoint** at `/api/mcp`
  (JSON-RPC: `initialize`/`tools/list`/`tools/call → scan_website`).

### Authentication (new, opt-in)
- Supabase Auth via `@supabase/ssr`: `/login`, `/signup` (with email-confirmation
  flow), `useAuth()` context, client-side `RouteGuard`, and an optimistic
  `proxy.js` cookie guard.
- Working logout + real user display in the sidebar.
- **Opt-in:** inactive until `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  are set; the app runs exactly as before until then. `/result` stays public.

### Product honesty
- The 7 demo dashboard routes carry a "preview / sample data" banner.
- Non-functional nav (Billing, API keys, Integrations, Settings) is disabled with
  a "Soon" tag instead of linking to the wrong page.

---

## 4. What we lack (gaps)

### A. Product is a demo shell where it counts
- **The dashboard is entirely mock data.** `analytics`, `insights`,
  `recommendations`, `competitors`, `reports`, `team`, `org-command-center`,
  `optimization-workspace`, `prompt-intelligence`, `hosted-mcp` all render
  hardcoded sample content. This is the single biggest gap between "looks like a
  product" and "is a product."
- **Auth ≠ personalized data yet.** A user can sign up and log in, but the
  dashboard doesn't show *their* scans. There's no "my scans" view backed by the
  Supabase `scans` table.
- Billing, API keys, Integrations, Settings are "Soon" stubs — no real flows.

### B. Data & persistence
- Backend `scan_tracker` (scan status) and the rate-limiter buckets are
  **in-memory** — lost on restart and not shared across instances. Fine for a
  single Render instance; breaks under horizontal scaling or on cold starts.
- No documented **Row Level Security** policies on the Supabase `scans` table.

### C. Auth completeness & hardening
- No **password reset / forgot-password** flow.
- No **social login** (Google/GitHub OAuth).
- Route protection is **client-side + optimistic proxy only**; there's no
  server-side enforcement. Acceptable while the dashboard is sample data, but
  must become server-enforced (`getServerSideProps` + `lib/supabase/server.js`)
  the moment it shows real user data.
- Supabase **service-role key rotation** is still pending (owner action).

### D. Infra & quality
- **CI only tests the backend.** No frontend build/lint/typecheck in CI, and the
  frontend has no test runner wired (`package.json` has no `test` script; a stray
  `__tests__/verification.test.ts` never runs).
- No **error monitoring** (e.g. Sentry) on frontend or backend — only analytics.
- No **end-to-end tests** for the scan funnel or the auth flow.
- The **`next dev` server has an HMR crash loop** (`isrManifest` overlay) that
  blanks app-layout pages in-browser; all verification currently goes through
  production builds. See memory `visum-verification-notes`.
- Two local Python venvs (`venv/` and `backend/venv/`) not consolidated.

### E. Go-to-market
- ✅ Production dogfood score **confirmed: 100/100** — ready to use as a
  landing-page proof point.
- Stripe payment link is optional/unconfigured — no real Pro upgrade path.

---

## 5. Roadmap — what to work on next

### P0 — Make it a real product
1. ✅ **Wire the dashboard to real data.** Done — `MyScans` shows the signed-in
   user's own scans; sample panels are separated and labelled. (PR #4)
2. ✅ **Server-side auth + RLS.** Done — `getServerSideProps` enforcement plus
   RLS policies scoped to `user_id = auth.uid()`, verified both directions. (PR #4)
3. ✅ **Deploy & verify 90+.** Done — production scores **100/100**. Fixing the
   speed-measurement bug was required to get an honest number.
4. **Rotate the Supabase service-role key** (owner action — still outstanding).
5. **Redeploy Vercel so auth activates.** `NEXT_PUBLIC_*` vars are inlined at
   build time; they're set but not yet in the deployed bundle.

### P1 — Trust, retention, resilience
5. **Auth flows:** password reset + at least one OAuth provider.
6. **Persist backend state:** move `scan_tracker` and rate-limiting to Supabase
   or Redis so status survives restarts and works across instances.
7. **Frontend in CI:** add build + lint + typecheck (and a real test runner) to
   `ci.yml`; add a smoke E2E for scan → result and login.
8. **Fix the dev server** HMR crash (upgrade/patch Next) so live preview works.

### P2 — Polish & scale
9. **Build out or remove** Billing / API keys / Integrations / Settings — don't
   ship permanent "Soon" tags.
10. **Error monitoring** (Sentry) on both tiers.
11. **Harden the MCP endpoint** for production load (the `tools/call` scan can
    exceed serverless timeouts on slow sites; consider async + status polling).
12. Consolidate the two Python venvs.

---

## 6. Immediate next steps (this week)

1. Merge the current branch (`fix/honest-scoring-and-trust-copy`) → open the PR.
2. Set the two `NEXT_PUBLIC_SUPABASE_*` env vars in Vercel to activate auth; turn
   on Email auth in Supabase.
3. Confirm the production dogfood score.
4. Spike the **"My Scans"** view — the highest-leverage step toward a real product.
