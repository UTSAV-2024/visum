# Visum Architecture

## Overview

Visum is an AI Agent Readiness Scanner that evaluates how well websites can be read by AI agents like ChatGPT and Claude.

## Backend (FastAPI)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ping` | Lightweight health check — no auth, no DB, instant response |
| GET | `/health` | Full health status with version and timestamp |
| GET | `/` | Root endpoint with API info |
| POST | `/scan` | Submit a URL for scanning |
| GET | `/status/{scan_id}` | Poll scan status by ID |

### Component Structure

- `app/main.py` — FastAPI app, routes, CORS, rate limiting
- `app/crawler.py` — Website crawling logic
- `app/scorer.py` — Scoring engine (8 checks)
- `app/schemas.py` — Pydantic models
- `app/checks/` — Individual check implementations
  - `robots.py` — AI Bot Permissions
  - `schema_ld.py` — JSON-LD Structured Data
  - `meta.py` — Meta Tags & Open Graph
  - `llms_txt.py` — llms.txt File
  - `mcp.py` — MCP Endpoint
  - `rendering.py` — JavaScript Rendering
  - `sitemap.py` — Sitemap.xml
  - `speed.py` — Page Load Speed

### CORS Configuration

CORS is configured via the `ALLOWED_ORIGINS` environment variable (comma-separated list).

**Default:** `http://localhost:3000,https://visum-eight.vercel.app`

The production frontend (`https://visum-eight.vercel.app`) is included by default. To add additional origins, set the `ALLOWED_ORIGINS` env var in your Render dashboard or `.env` file.

## Frontend (Next.js — Pages Router)

- `/pages/index.js` — Home page with Hero, stats, checks
- `/pages/result.js` — Scan results page (requires a signed-in user)
- `/pages/pricing.js` — Plans: Free, Pro, Ultimate
- `/pages/login.js`, `/pages/signup.js` — Email/password and Google sign-in
- `/pages/api/scan.js` — The only way to run a scan: verifies the session,
  claims quota, proxies the backend, records the scan and its storage cost
- `/pages/api/account.js` — The signed-in user's plan, quota and storage
- `/pages/api/auth/callback.js` — OAuth / email-confirmation code exchange
- `/pages/api/subscription/upgrade.js` — Plan activation (payment-provider seam)
- `components/` — Reusable UI components
- `lib/` — API client, plan catalogue, auth guards, analytics, utilities
- `lib/server/` — Server-only modules (service-role Supabase access)
