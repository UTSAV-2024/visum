# Visum Improvement Checklist

From the brutal review on 2026-07-19. Check items off as they're fixed.
Maintained automatically: items get ticked when the corresponding change/commit lands.

## P0 — Broken product (fix first)

- [x] Install Playwright Chromium in the local backend venv (`python -m playwright install chromium`) — installed in `backend/venv` (exit 0)
- [x] Add `playwright install chromium` to the Render build command so the deployed backend can measure speed — present in `render.yaml` buildCommand
- [x] Make the Page Load Speed check report "not measured" honestly (no fabricated 5/10) when Playwright is unavailable — `speed.py` now returns `measured=False`, excluded from total
- [x] Make the JavaScript Rendering check fail/skip honestly when Playwright falls back to static HTML — crawler now sets `js_rendered`; `rendering.py` reports `measured=False` instead of comparing static-vs-static

## P0 — Dogfooding (your own site scores 45/100)

- [x] Add JSON-LD structured data to the Visum frontend (`WebSite` + `SoftwareApplication` schema) — added to `frontend/pages/_document.js`
- [x] Add a complete `llms.txt` to the Visum frontend (project name, description, doc links) — added at `frontend/public/llms.txt`
- [ ] Add an MCP endpoint (or OpenAPI spec) to Visum itself
- [ ] Verify the deployed site scores 90+ on its own scanner; use that as a marketing point

## P1 — Trust: copy and numbers

- [x] Write unique "WHY IT MATTERS" copy per check — per-check `whyItMatters` in `check-detail-card.tsx`
- [x] Fix IMPACT text so "Medium" severity doesn't say "significantly affects" — `IMPACT_SENTENCE` map keyed by severity
- [x] Remove audience-mismatched copy — dropped "Shopify merchants have this built-in" (`mcp.py`); llms.txt copy now says it's low-priority for e-commerce
- [x] Fix "Estimated score gain" so it never exceeds the points actually available — capped to `max_score - score` (`cappedGain`)
- [x] Reconcile "AVG SCORE %" vs "total/100" — StatsStrip now uses the weighted `earned/available` so it matches the headline
- [x] Remove or cite the "3x more likely to appear in AI answers" statistic — no such uncited stat remains on the real result flow (remaining `2.3x`/`4x` copy lives only in sample-data demos behind the "preview" banner)
- [x] Remove or cite "every point increase correlates with higher citation rates" — removed from `check-detail-card.tsx`; also removed the uncited "67%" schema stat

## P1 — Check design correctness

- [x] Reweight the MCP Endpoint check — reduced 20→10 and reframed as an emerging "bonus" signal; scorer normalises to /100 so weights stay consistent
- [x] Fix robots.txt scoring: absence of robots.txt means "all crawlers allowed" and should not score 0/15 — now scores 13/15 and passes, with honest copy
- [x] Harden `_fetch`: checks content-type and detects soft-404s (HTML shell for a .txt/.xml/JSON resource) so an SPA 200 doesn't count as llms.txt/sitemap
- [x] Add a regression test: a site with no llms.txt must yield "No llms.txt file found", never "found but incomplete" — `test_llms_missing_says_not_found_not_incomplete` (whitespace-only bodies now treated as absent)

## P2 — Product honesty

- [x] Gate unfinished mock pages (Team Management, Competitor Intelligence, Reports, AI Insights) behind "coming soon" or finish them — all 7 demo routes now show a "preview / sample data" banner via `frontend/components/app-layout.tsx`
- [ ] Audit nav so users can't click into non-functional billing/API-key screens

## P2 — Security & repo hygiene

- [~] Move `SUPABASE_SERVICE_KEY` out of `frontend/.env.local` (service-role key must live server-side only) — verified: the key is read only in `pages/api/*.js` (server-side) via `process.env`, with no `NEXT_PUBLIC_` prefix, so it never reaches the client bundle. `.env.local` is untracked. Physically relocating it to a dedicated server env is still a deployment follow-up.
- [ ] Rotate the Supabase service-role key — **requires the user** (Supabase dashboard action; cannot be done from code)
- [x] Remove duplicate lockfile / set `turbopack.root` in next.config — `turbopack.root` pinned to the frontend dir in `next.config.mjs`
- [ ] Consolidate the two Python venvs (root `venv/` and `backend/venv/`) — left for the user (destructive local env change; both are gitignored)
- [x] Remove committed debug/scratch files: `backend/debug_cors.py`, `backend/restart_backend.py`, `backend/test_manual.py`, `testresultsday2.txt` — removed (also removed stray `backend/.env.example.backup1`)
- [x] Add `nul` (and similar Windows reserved names) awareness — added to root `.gitignore`
