# Deployment Guide

## Backend (Render)

The backend is deployed as a Render Web Service.

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
