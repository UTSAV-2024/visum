# Deployment Guide

## Frontend (Vercel) — payments

Card checkout turns on only when **both** `STRIPE_SECRET_KEY` and
`STRIPE_WEBHOOK_SECRET` are set. That pairing is deliberate: the webhook is the
only thing that grants a plan, so a secret key on its own would create
checkouts that could never be safely fulfilled. With either missing, the
pricing page falls back to the manual-grant path and says so plainly.

| Variable | Required for payments | Where to find it |
|----------|----------------------|------------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe → Developers → API keys (`sk_live_…` / `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe → Developers → Webhooks → your endpoint's signing secret (`whsec_…`) |
| `STRIPE_PRICE_PRO` | Yes | Stripe → Products → Pro → Pricing (`price_…`), recurring, must be $15/mo |
| `STRIPE_PRICE_ULTIMATE` | Yes | Stripe → Products → Ultimate → Pricing (`price_…`), recurring, must be $70/mo |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | No | Fallback only — a Payment Link can't attribute a payment to an account, so plans bought that way need granting by hand |

Amounts must match `frontend/lib/plans.js`. A tier with no price ID can't be
bought: checkout answers "not available" rather than charging a wrong amount.

### Webhook setup

Point a Stripe webhook endpoint at:

```
https://<your-domain>/api/subscription/webhook
```

Subscribe it to exactly these events:

- `checkout.session.completed` — provisions the plan
- `customer.subscription.updated` — follows Stripe's status (`past_due`, etc.)
- `customer.subscription.deleted` — drops the account back to Free

The handler verifies every signature before reading the body, so an unsigned or
forged request is rejected with 400 and grants nothing. It is also idempotent:
Stripe delivers at least once, and re-running a fulfilment would reset
`scans_used` to 0 and hand out a fresh allowance for free.

> **Note:** `NEXT_PUBLIC_*` variables are inlined into the bundle at build time.
> Changing one has no effect on a deployment that was already built — you must
> redeploy *after* the change, with the build cache off.

## Backend (Render)

The backend is deployed as a Render Web Service (Docker runtime — see
`render.yaml`). Note that a Render service's runtime **cannot be changed in
place**; switching runtimes means creating a new service from the Blueprint.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | — | Supabase/Postgres connection string |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000,https://visum-eight.vercel.app` | Comma-separated CORS origins |
| `MAX_CONCURRENT_SCANS` | No | `5` | Maximum concurrent scan limit |
| `SCAN_SEMAPHORE_WAIT_SECONDS` | No | `30` | Timeout for semaphore acquisition |

### Startup

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Health Check Endpoint

**GET /ping**

Designed for uptime monitoring and deployment verification.

### Example

```
$ curl https://visum-backend.onrender.com/ping
{"pong": true}
```

### Purpose

- **UptimeRobot monitoring** — Configure UptimeRobot to ping `GET /ping` every 5 minutes
  - UptimeRobot free plan uses `HEAD` requests — this is now supported (returns HTTP 200 with no body)
- **Render health monitoring** — Use as the Render health check path
- **Deployment verification** — Quick smoke test after deployment
- **Cold-start prevention** — Regular pings keep the service warm and reduce cold-start latency

### Responses

| Method | Status | Body |
|--------|--------|------|
| `GET` | 200 | `{"pong": true}` |
| `HEAD` | 200 | Empty (no body) |

- No authentication required
- No database access
- No external service calls
- Near-instant response time

## CORS

The backend uses the `ALLOWED_ORIGINS` environment variable (comma-separated).

**Default value:**

```
http://localhost:3000,https://visum-eight.vercel.app
```

The production frontend (`https://visum-eight.vercel.app`) is included by default. To change allowed origins, set `ALLOWED_ORIGINS` in your Render dashboard.

## Deployment Verification Checklist

1. **Verify `/ping` returns 200**
   ```
   curl https://visum-backend.onrender.com/ping
   ```
   Expected: `{"pong": true}`

2. **Verify Render service is healthy**
   - Check Render dashboard → Service → Logs
   - Confirm no startup errors
   - Confirm `DATABASE_URL` placeholder detection is working (if no DB)

3. **Verify frontend can reach backend**
   - Open https://visum-eight.vercel.app
   - Submit a scan URL
   - Confirm no network errors in browser DevTools

4. **Verify scan endpoint works**
   ```
   curl -X POST https://visum-backend.onrender.com/scan \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com"}'
   ```
   Expected: JSON response with `scan_id`, `result`, and `status: "completed"`

5. **Verify no CORS errors**
   - Open browser DevTools Console
   - Navigate https://visum-eight.vercel.app
   - Confirm no CORS-related errors appear when the frontend calls the backend

## Manual Tasks After Deployment

- [ ] Create UptimeRobot monitor pointed at `GET /ping`
- [ ] Verify Render environment variables are set correctly
- [ ] Run benchmark scans (Gymshark, WooCommerce, Anthropic)
- [ ] Verify production logs for any errors
- [ ] Verify Supabase events once service is healthy
