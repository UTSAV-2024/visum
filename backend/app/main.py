# backend/app/main.py
import os
import re
import logging
import asyncio
import uuid
import time
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timezone
from typing import Dict
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from .schemas import (
    ScanRequest,
    ScanResponse,
    ScanStatus,
    ScanStatusResponse,
)
from .crawler import SiteCrawler
from .scorer import run_scan
from .validation import validate_scan_results
import json
from sqlalchemy import create_engine, text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Environment ──────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parents[2]  # project root
BACKEND_DIR = Path(__file__).resolve().parent.parent  # backend/

# Try loading from multiple locations (Render-friendly)
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BACKEND_DIR / ".env")  # also try backend/.env
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

# ── Detect placeholder DATABASE_URL values ──────────────────────────
# Render environment may have a placeholder with literal strings like
# 'port', 'hostname', 'password' if copied from .env.example.
_PLACEHOLDER_PATTERNS = ["user:password@", ":port/", "5432:port", "hostname"]

engine = None
if DATABASE_URL:
    # Reject placeholder URLs that would crash SQLAlchemy
    url_lower = DATABASE_URL.lower()
    is_placeholder = any(p in url_lower for p in _PLACEHOLDER_PATTERNS)
    if is_placeholder:
        logger.warning(f"DATABASE_URL appears to be a placeholder (contains 'port', 'password', or 'hostname'). Running without database.")
    else:
        try:
            engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=300,
            )
            logger.info("Database engine created successfully")
        except Exception as e:
            logger.warning(f"Database engine creation failed: {e}. Running without database.")
            engine = None
else:
    logger.info("DATABASE_URL not set. Running without database.")

app = FastAPI(
    title="Visum API",
    description="Agent readiness scanner for non-Shopify websites",
    version="0.1.0"
)

# ── CORS ─────────────────────────────────────────────────────────────
DEFAULT_ORIGINS = "http://localhost:3000,https://visum-eight.vercel.app"
allowed_origins = os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global Scan Timeout ──────────────────────────────────────────────
SCAN_TIMEOUT_SECONDS = int(os.getenv("SCAN_TIMEOUT_SECONDS", "45"))
_start_time: float | None = None


# ── Security Headers Middleware ──────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to every response.
    CSP is not set here — it's configured on the Next.js frontend."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


# ── Env Validation ───────────────────────────────────────────────────


def _validate_env_vars():
    """Check for missing or misconfigured environment variables on startup.
    Logs warnings but does not block startup (graceful degradation design)."""
    # DATABASE_URL is optional — the app gracefully degrades without it.
    if not os.getenv("DATABASE_URL"):
        logger.warning(
            "Missing environment variable: DATABASE_URL. "
            "The database feature will be disabled. "
            "See backend/.env.example for all available variables."
        )

    # Validate that integer vars parse correctly
    int_vars = {
        "MAX_CONCURRENT_SCANS": MAX_CONCURRENT_SCANS,
        "SCAN_SEMAPHORE_WAIT_SECONDS": SCAN_SEMAPHORE_WAIT_SECONDS,
        "MAX_SCAN_CACHE_SIZE": MAX_SCAN_CACHE_SIZE,
        "SCAN_CACHE_TTL_SECONDS": SCAN_CACHE_TTL_SECONDS,
        "CRAWLER_TIMEOUT_MS": CRAWLER_TIMEOUT_MS,
    }
    for name, val in int_vars.items():
        if val < 0:
            logger.warning(f"Environment variable {name} has a negative value ({val}). Using default.")


# ── Rate Limiting ────────────────────────────────────────────────────
RATE_LIMIT_MAX = int(os.getenv("RATE_LIMIT_SCANS_PER_HOUR", "30"))
RATE_LIMIT_WINDOW_SECONDS = 3600  # 1 hour


class IPRateLimiter:
    """Simple in-memory IP-based rate limiter.
    Not distributed — resets on server restart. Sufficient for beta launch."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._buckets: dict[str, list[float]] = {}

    def _cleanup(self, ip: str, now: float):
        """Remove timestamps outside the current window."""
        cutoff = now - self.window_seconds
        timestamps = self._buckets.get(ip, [])
        self._buckets[ip] = [t for t in timestamps if t > cutoff]

    def is_allowed(self, ip: str) -> bool:
        """Return True if the request is allowed, False if rate-limited."""
        now = time.time()
        self._cleanup(ip, now)
        timestamps = self._buckets.get(ip, [])
        if len(timestamps) >= self.max_requests:
            return False
        self._buckets.setdefault(ip, []).append(now)
        return True

    def retry_after_seconds(self, ip: str) -> int:
        """Return seconds until the rate limit resets for this IP."""
        timestamps = self._buckets.get(ip, [])
        if len(timestamps) < self.max_requests:
            return 0
        cutoff = time.time() - self.window_seconds
        oldest = min(t for t in timestamps if t > cutoff)
        return int(self.window_seconds - (time.time() - oldest))


scan_rate_limiter = IPRateLimiter(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_SECONDS)


# ── Concurrency ──────────────────────────────────────────────────────
MAX_CONCURRENT_SCANS = int(os.getenv("MAX_CONCURRENT_SCANS", "5"))
SCAN_SEMAPHORE_WAIT_SECONDS = int(os.getenv("SCAN_SEMAPHORE_WAIT_SECONDS", "30"))
MAX_SCAN_CACHE_SIZE = int(os.getenv("MAX_SCAN_CACHE_SIZE", "1000"))
SCAN_CACHE_TTL_SECONDS = int(os.getenv("SCAN_CACHE_TTL_SECONDS", "3600"))
CRAWLER_TIMEOUT_MS = int(os.getenv("CRAWLER_TIMEOUT_MS", "60000"))

scan_semaphore = asyncio.Semaphore(MAX_CONCURRENT_SCANS)
scan_tracker: Dict[str, dict] = {}

crawler = SiteCrawler(
    timeout_ms=CRAWLER_TIMEOUT_MS
)


def _cleanup_old_scans():
    """Remove completed/failed scans older than SCAN_CACHE_TTL_SECONDS to prevent memory leaks."""
    now = time.time()
    stale_keys = [
        sid for sid, info in scan_tracker.items()
        if info.get("completed_at")
        and (now - info["completed_at"]) > SCAN_CACHE_TTL_SECONDS
    ]
    for sid in stale_keys:
        del scan_tracker[sid]
    if stale_keys:
        logger.info(f"Cleaned up {len(stale_keys)} stale scan records")
    if len(scan_tracker) > MAX_SCAN_CACHE_SIZE:
        sorted_keys = sorted(scan_tracker.keys(), key=lambda k: scan_tracker[k].get("created_at", 0))
        excess = len(scan_tracker) - MAX_SCAN_CACHE_SIZE
        for sid in sorted_keys[:excess]:
            del scan_tracker[sid]
        logger.info(f"Hard cap cleanup: removed {excess} oldest scan records")


_URL_REGEX = re.compile(
    r"^https?://"
    r"([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+"
    r"[a-zA-Z]{2,}"
    r"(:\d+)?"
    r"(/[^\s]*)?$"
)


def _validate_url(url: str) -> str:
    """Validate and normalise a URL. Returns normalised URL or raises HTTPException."""
    url = url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    if not _URL_REGEX.match(url):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid URL format: '{url}'. Must be a valid http(s) URL."
        )
    try:
        from urllib.parse import urlparse
        import ipaddress
        import socket
        hostname = urlparse(url).hostname
        if hostname:
            if hostname in ("localhost", "127.0.0.1", "0.0.0.0", "::1"):
                raise HTTPException(status_code=400, detail="Scanning internal/localhost URLs is not allowed.")
            try:
                addr = socket.getaddrinfo(hostname, None)
                for _family, _type, _proto, _canonname, sockaddr in addr:
                    ip = ipaddress.ip_address(sockaddr[0])
                    if ip.is_private or ip.is_loopback or ip.is_link_local:
                        raise HTTPException(status_code=400, detail=f"Scanning private/internal IP addresses is not allowed: {ip}")
            except (socket.gaierror, ValueError):
                pass
    except HTTPException:
        raise
    except Exception:
        pass
    return url


# ── Endpoints ────────────────────────────────────────────────────────

@app.get("/ping")
async def ping():
    """Lightweight health check for UptimeRobot, Render monitoring, and deployment verification.
    No authentication, no database access, no external calls — near-instant response."""
    return {"pong": True}


@app.head("/ping", include_in_schema=False)
async def ping_head():
    """HEAD variant for UptimeRobot free plan compatibility. Returns 200 with no body."""
    return Response(status_code=200)


@app.get("/health")
async def health():
    db_status = "connected" if engine else "disabled"
    return {
        "status": "ok",
        "version": "0.1.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_status,
        "uptime_s": int(time.time() - _start_time) if _start_time else None,
    }


@app.get("/")
async def root():
    return {
        "message": "Visum Agent Readiness Scanner",
        "docs": "/docs",
        "scan": "POST /scan with {'url': 'https://yoursite.com'}",
        "status": "LIVE",
    }


@app.get("/status/{scan_id}", response_model=ScanStatusResponse)
async def get_scan_status(scan_id: str):
    """Get the status of a scan by scan_id."""
    info = scan_tracker.get(scan_id)
    if info is None:
        raise HTTPException(status_code=404, detail=f"Scan '{scan_id}' not found")
    return ScanStatusResponse(
        scan_id=scan_id,
        url=info.get("url", ""),
        status=info["status"],
        total_score=info.get("total_score"),
        band=info.get("band"),
        error=info.get("error"),
        created_at=info.get("created_at", ""),
        completed_at=str(info.get("completed_at")) if info.get("completed_at") else None,
    )


@app.post("/scan", response_model=ScanResponse)
async def scan(request: ScanRequest, fastapi_request: Request):
    """Crawl a URL and run all 8 checks. Returns ScanResponse with results."""
    # ── Rate limiting check ──
    client_ip = fastapi_request.client.host if fastapi_request.client else "unknown"
    # Respect X-Forwarded-For if behind a proxy (Render, Vercel)
    forwarded = fastapi_request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()

    if not scan_rate_limiter.is_allowed(client_ip):
        retry_after = scan_rate_limiter.retry_after_seconds(client_ip)
        logger.info(f"Rate limit hit: IP={client_ip}, retry_after={retry_after}s")
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )
    url = _validate_url(request.url)
    email=request.email
    scan_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    scan_tracker[scan_id] = {
        "url": url,
        "status": ScanStatus.PENDING,
        "created_at": now_iso,
        "completed_at": None,
        "total_score": None,
        "band": None,
        "error": None,
    }
    logger.info(f"[{scan_id}] Scan requested: {url}")

    try:
        try:
            await asyncio.wait_for(
                scan_semaphore.acquire(),
                timeout=SCAN_SEMAPHORE_WAIT_SECONDS
            )
        except asyncio.TimeoutError:
            scan_tracker[scan_id]["status"] = ScanStatus.FAILED
            scan_tracker[scan_id]["error"] = "Semaphore timeout"
            scan_tracker[scan_id]["completed_at"] = time.time()
            raise HTTPException(status_code=503, detail="Server busy. Please retry later.")

        scan_tracker[scan_id]["status"] = ScanStatus.RUNNING

        scan_start_time = time.time()
        try:
            # ── Wrap the entire scan in a global timeout ──
            async def _run_scan_pipeline():
                logger.info(f"[{scan_id}] Crawling...")
                crawl_data = await crawler.crawl(url)
                if crawl_data is None:
                    raise HTTPException(status_code=500, detail="Crawler returned None")
                logger.info(f"[{scan_id}] Crawl done.")
                result = await run_scan(crawl_data)
                return result

            result = await asyncio.wait_for(
                _run_scan_pipeline(),
                timeout=SCAN_TIMEOUT_SECONDS
            )
            if engine:
                try:
                    with engine.begin() as conn:
                        conn.execute(
                            text("""
                                INSERT INTO scans (
                                    scan_id,
                                    url,
                                    total_score,
                                    band,
                                    checks,
                                    scan_time_ms,
                                    email
                                )
                                VALUES (
                                    :scan_id,
                                    :url,
                                    :total_score,
                                    :band,
                                    CAST(:checks AS jsonb),
                                    :scan_time_ms,
                                    :email
                                )
                            """),
                            {
                                "scan_id": scan_id,
                                "url": url,
                                "total_score": result.total_score,
                                "band": result.band,
                                "checks": json.dumps(
                                    json.loads(result.model_dump_json())["checks"]
                                ),
                                "scan_time_ms": result.scan_time_ms,
                                "email": email,
                            },
                        )
                except Exception as e:
                    logger.warning(f"Database insert failed: {e}")     
            logger.info(f"[{scan_id}] Score: {result.total_score}/100 band={result.band}")

            # ── Verification: validate every metric before returning ──
            validation = validate_scan_results(
                total_score=result.total_score,
                band=result.band,
                checks=result.checks,
                scan_time_ms=result.scan_time_ms,
            )

            # If validation fails, log but still return (frontend canRender guards handle hiding)
            if not validation.get("verification", {}).get("can_render_overall", True):
                logger.warning(
                    f"[{scan_id}] Validation warnings: "
                    f"{validation['verification']['blocking_failures']}"
                )

            # Attach verification metadata to ScanResult
            result.verification = validation["verification"]

            scan_tracker[scan_id].update({
                "status": ScanStatus.COMPLETED,
                "total_score": result.total_score,
                "band": result.band,
                "completed_at": time.time(),
            })

            return ScanResponse(scan_id=scan_id, result=result, status=ScanStatus.COMPLETED)
        finally:
            scan_semaphore.release()
            logger.info(f"[{scan_id}] Semaphore released")

    except HTTPException:
        scan_tracker[scan_id]["status"] = ScanStatus.FAILED
        scan_tracker[scan_id]["error"] = str(scan_tracker[scan_id].get("error", ""))
        scan_tracker[scan_id]["completed_at"] = time.time()
        raise
    except asyncio.TimeoutError:
        elapsed = time.time() - scan_start_time
        logger.error(f"[{scan_id}] Global scan timeout after {elapsed:.1f}s (limit={SCAN_TIMEOUT_SECONDS}s) for {url}")
        scan_tracker[scan_id]["status"] = ScanStatus.FAILED
        scan_tracker[scan_id]["error"] = f"Scan timed out after {elapsed:.0f}s"
        scan_tracker[scan_id]["completed_at"] = time.time()
        raise HTTPException(status_code=408, detail="Scan timed out. Please try again.")
    except Exception as e:
        logger.error(f"[{scan_id}] Exception: {type(e).__name__}: {str(e)}", exc_info=True)
        scan_tracker[scan_id]["status"] = ScanStatus.FAILED
        scan_tracker[scan_id]["error"] = str(e)
        scan_tracker[scan_id]["completed_at"] = time.time()
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
    finally:
        _cleanup_old_scans()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    status_code = exc.status_code
    detail = exc.detail if exc.detail else "An error occurred"
    if status_code >= 500:
        logger.error(f"HTTP {status_code}: {detail}")
    elif status_code in (400, 422):
        logger.info(f"HTTP {status_code}: {detail}")
    return JSONResponse(
        status_code=status_code,
        content={"detail": detail, "status_code": status_code},
        headers=exc.headers,  # pass through Retry-After and any other headers
    )


@app.on_event("startup")
async def startup():
    global _start_time
    _start_time = time.time()
    _validate_env_vars()
    logger.info(
        f"Visum API starting: max_concurrent={MAX_CONCURRENT_SCANS}, "
        f"cache_ttl={SCAN_CACHE_TTL_SECONDS}s, cache_max={MAX_SCAN_CACHE_SIZE}, "
        f"rate_limit={RATE_LIMIT_MAX}/hour, scan_timeout={SCAN_TIMEOUT_SECONDS}s"
    )
    logger.info(f"Database: {'connected' if engine else 'disabled'}")



@app.on_event("shutdown")
async def shutdown():
    logger.info(f"Visum API shutting down. Active tracked scans: {len(scan_tracker)}")
