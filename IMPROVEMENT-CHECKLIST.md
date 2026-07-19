# Visum Improvement Checklist

From the brutal review on 2026-07-19. Check items off as they're fixed.
Maintained automatically: items get ticked when the corresponding change/commit lands.

## P0 — Broken product (fix first)

- [ ] Install Playwright Chromium in the local backend venv (`python -m playwright install chromium`)
- [ ] Add `playwright install chromium` to the Render build command so the deployed backend can measure speed
- [ ] Make the Page Load Speed check report "not measured" honestly (no fabricated 5/10) when Playwright is unavailable
- [ ] Make the JavaScript Rendering check fail/skip honestly when Playwright falls back to static HTML (currently compares static-vs-static and always awards 10/10, `backend/app/crawler.py:172`)

## P0 — Dogfooding (your own site scores 45/100)

- [x] Add JSON-LD structured data to the Visum frontend (`WebSite` + `SoftwareApplication` schema) — added to `frontend/pages/_document.js`
- [x] Add a complete `llms.txt` to the Visum frontend (project name, description, doc links) — added at `frontend/public/llms.txt`
- [ ] Add an MCP endpoint (or OpenAPI spec) to Visum itself
- [ ] Verify the deployed site scores 90+ on its own scanner; use that as a marketing point

## P1 — Trust: copy and numbers

- [ ] Write unique "WHY IT MATTERS" copy per check (currently the identical paragraph repeats on every issue)
- [ ] Fix IMPACT text so "Medium" severity doesn't say "significantly affects" (severity label and sentence must agree)
- [ ] Remove audience-mismatched copy ("Shopify merchants have this built-in" shown for non-Shopify sites; Cursor/Copilot llms.txt copy shown for e-commerce scans)
- [ ] Fix "Estimated score gain" so it never exceeds the points actually available on that check
- [ ] Reconcile "AVG SCORE %" vs "total/100" (63% shown next to 50/100 confuses users)
- [ ] Remove or cite the "3x more likely to appear in AI answers" statistic
- [ ] Remove or cite "every point increase correlates with higher citation rates"

## P1 — Check design correctness

- [ ] Reweight the MCP Endpoint check (20 pts that ~every real site auto-fails feels rigged; make it a bonus or reduce weight)
- [ ] Fix robots.txt scoring: absence of robots.txt means "all crawlers allowed" and should not score 0/15 with misleading copy
- [ ] Harden `_fetch` (`backend/app/crawler.py:28`): check content-type and detect soft-404s so an SPA shell returned with HTTP 200 doesn't count as llms.txt/sitemap
- [ ] Add a regression test: a site with no llms.txt must yield "No llms.txt file found", never "found but incomplete"

## P2 — Product honesty

- [x] Gate unfinished mock pages (Team Management, Competitor Intelligence, Reports, AI Insights) behind "coming soon" or finish them — all 7 demo routes now show a "preview / sample data" banner via `frontend/components/app-layout.tsx`
- [ ] Audit nav so users can't click into non-functional billing/API-key screens

## P2 — Security & repo hygiene

- [ ] Move `SUPABASE_SERVICE_KEY` out of `frontend/.env.local` (service-role key must live server-side only)
- [ ] Rotate the Supabase service-role key
- [ ] Remove duplicate lockfile (root `package-lock.json` vs `frontend/package-lock.json`) or set `turbopack.root` in next.config
- [ ] Consolidate the two Python venvs (root `venv/` and `backend/venv/`)
- [ ] Remove committed debug/scratch files: `backend/debug_cors.py`, `backend/restart_backend.py`, `backend/test_manual.py`, `testresultsday2.txt`
- [ ] Add `nul` (and similar Windows reserved names) awareness — the stray `frontend/nul` file broke the entire build once already
