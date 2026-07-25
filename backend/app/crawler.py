# backend/app/crawler.py
import asyncio
import time
import logging
from urllib.parse import urlparse
import httpx
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

# How long we let client-side JS hydrate after domcontentloaded before
# snapshotting the DOM. This is our own instrumentation cost and must never be
# counted against the site's measured load time.
HYDRATION_WAIT_MS = 2000


def looks_like_html(text: str) -> bool:
    """Detect an HTML document masquerading as another resource (soft-404 SPA shell)."""
    head = text.lstrip()[:300].lower()
    return head.startswith("<!doctype") or head.startswith("<html") or "<head" in head[:150]


class SiteCrawler:

    def __init__(self, timeout_ms: int = 60000):
        self.timeout_ms = timeout_ms
        self.http_timeout = 15

    def get_base_url(self, url: str) -> str:
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"

    def normalise_url(self, url: str) -> str:
        url = url.strip()
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        return url

    async def _fetch(self, client: httpx.AsyncClient, url: str, expect: str = "text") -> str:
        """Fetch a non-HTML resource (robots.txt, llms.txt, sitemap.xml, JSON).

        Guards against soft-404s: SPAs often return their HTML shell with
        HTTP 200 for any path, which must not count as the resource existing.
        """
        try:
            resp = await client.get(url)
            if resp.status_code != 200:
                return ""
            content_type = resp.headers.get("content-type", "").lower()
            body = resp.text
            # An HTML response for a .txt/.xml/JSON resource is a soft-404
            if "text/html" in content_type or looks_like_html(body):
                logger.debug(f"_fetch rejected {url}: HTML response for expected {expect}")
                return ""
            if expect == "json":
                stripped = body.lstrip()
                is_sse = stripped.startswith("event:") or stripped.startswith("data:")
                if not (stripped.startswith("{") or stripped.startswith("[") or is_sse):
                    logger.debug(f"_fetch rejected {url}: not JSON/SSE")
                    return ""
            if expect == "xml" and "<" not in body[:200]:
                logger.debug(f"_fetch rejected {url}: not XML")
                return ""
            return body
        except Exception as e:
            logger.debug(f"_fetch failed {url}: {e}")
        return ""

    async def _fetch_with_status(self, client: httpx.AsyncClient, url: str) -> tuple:
        try:
            resp = await client.get(url)
            return resp.text, resp.status_code
        except Exception as e:
            logger.debug(f"_fetch_with_status failed {url}: {e}")
            return "", 0

    async def crawl(self, url: str) -> dict:
        url = self.normalise_url(url)
        base_url = self.get_base_url(url)
        crawl_start = time.time()

        crawl_data = {
            "url":          url,
            "base_url":     base_url,
            "html_static":  "",
            "html_rendered": "",
            "robots_txt":   "",
            "llms_txt":     "",
            "sitemap_xml":  "",
            "mcp_response": None,
            "performance":  {},
            "status_code":  None,
            "crawl_ms":     0,
            "error":        None,
            # True only when Playwright actually rendered the page. When it
            # falls back to static HTML, checks that compare static-vs-rendered
            # (JS Rendering) or need real timings (Page Load Speed) must not
            # fabricate a score — they report measured=False instead.
            "js_rendered":  False,
        }

        # ── Step 1: Parallel httpx fetches ──────────────────────────────────
        http_start = time.time()
        try:
            async with httpx.AsyncClient(
                timeout=self.http_timeout,
                follow_redirects=True,
                headers={"User-Agent": "Mozilla/5.0 (compatible; VIsumBot/1.0)"}
            ) as client:
                results = await asyncio.gather(
                    self._fetch_with_status(client, url),
                    self._fetch(client, f"{base_url}/robots.txt"),
                    self._fetch(client, f"{base_url}/llms.txt"),
                    self._fetch(client, f"{base_url}/sitemap.xml"),
                    self._fetch(client, f"{base_url}/.well-known/mcp"),
                    return_exceptions=True
                )

                if not isinstance(results[0], Exception):
                    crawl_data["html_static"], crawl_data["status_code"] = results[0]
                if not isinstance(results[1], Exception):
                    crawl_data["robots_txt"] = results[1]
                if not isinstance(results[2], Exception):
                    crawl_data["llms_txt"] = results[2]
                if not isinstance(results[3], Exception):
                    crawl_data["sitemap_xml"] = results[3]
                if not isinstance(results[4], Exception) and results[4]:
                    crawl_data["mcp_response"] = results[4]

            http_elapsed = time.time() - http_start
            logger.info(
                f"Crawl stage=httpx url={url} elapsed={http_elapsed:.1f}s "
                f"html_static={len(crawl_data['html_static'])} "
                f"robots={bool(crawl_data['robots_txt'])} "
                f"sitemap={bool(crawl_data['sitemap_xml'])}"
            )

        except asyncio.TimeoutError:
            logger.error(f"Crawl stage=httpx url={url} elapsed={time.time()-http_start:.1f}s error=timeout")
            crawl_data["error"] = "httpx: timeout"
        except httpx.TimeoutException as e:
            logger.error(f"Crawl stage=httpx url={url} elapsed={time.time()-http_start:.1f}s error=httpx_timeout")
            crawl_data["error"] = f"httpx: timeout - {str(e)}"
        except Exception as e:
            logger.error(f"Crawl stage=httpx url={url} elapsed={time.time()-http_start:.1f}s error={type(e).__name__}: {e}")
            crawl_data["error"] = f"httpx: {str(e)}"

        # ── Step 2: Playwright JS render ────────────────────────────────────
        playwright_start = time.time()
        try:
            logger.info(f"Crawl stage=playwright url={url} starting")
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
                )
                page = await context.new_page()

                load_start = time.time()

                await page.goto(
                    url,
                    wait_until="domcontentloaded",
                    timeout=self.timeout_ms
                )

                # Wait a bit for JS to hydrate after domcontentloaded.
                # NOTE: this wait must never be counted as page load time —
                # timings below come from the browser's Navigation Timing API,
                # which measures the real navigation and ignores this sleep.
                await page.wait_for_timeout(HYDRATION_WAIT_MS)

                content = await page.content()
                title = await page.title()
                nav = await page.evaluate(
                    """() => {
                        const e = performance.getEntriesByType('navigation')[0];
                        if (!e) return null;
                        return {
                            ttfb: Math.round(e.responseStart),
                            dcl: Math.round(e.domContentLoadedEventEnd),
                            load: Math.round(e.loadEventEnd),
                            duration: Math.round(e.duration),
                        };
                    }"""
                )

                await browser.close()

            # Prefer real browser timings; fall back to wall-clock with our own
            # hydration wait subtracted so it is never charged to the site.
            wall_ms = max(0, int((time.time() - load_start) * 1000) - HYDRATION_WAIT_MS)
            if nav:
                ttfb_ms = nav.get("ttfb") or None
                load_ms = (
                    nav.get("load")
                    or nav.get("dcl")
                    or nav.get("duration")
                    or wall_ms
                )
            else:
                ttfb_ms = None
                load_ms = wall_ms

            playwright_elapsed = time.time() - playwright_start
            crawl_data["html_rendered"] = content
            crawl_data["js_rendered"] = True
            crawl_data["performance"] = {
                "ttfb_ms": ttfb_ms if ttfb_ms is not None else load_ms,
                "load_ms": load_ms,
                "title": title,
            }

            logger.info(
                f"Crawl stage=playwright url={url} "
                f"elapsed={playwright_elapsed:.1f}s "
                f"html_rendered={len(content)} load_ms={load_ms} title={title}"
            )

        except asyncio.TimeoutError:
            logger.error(f"Crawl stage=playwright url={url} elapsed={time.time()-playwright_start:.1f}s error=timeout")
            crawl_data["error"] = "Playwright: timeout"
            if crawl_data["html_static"]:
                crawl_data["html_rendered"] = crawl_data["html_static"]
                logger.info(f"Crawl stage=playwright url={url} fallback=static_html ({len(crawl_data['html_static'])} chars)")
        except Exception as e:
            logger.error(f"Crawl stage=playwright url={url} elapsed={time.time()-playwright_start:.1f}s error={type(e).__name__}: {e}")
            crawl_data["error"] = f"Playwright: {str(e)}"
            # Fallback: use static HTML for schema/meta checks
            if crawl_data["html_static"]:
                crawl_data["html_rendered"] = crawl_data["html_static"]
                logger.info(f"Crawl stage=playwright url={url} fallback=static_html ({len(crawl_data['html_static'])} chars)")

        total_elapsed = time.time() - crawl_start
        crawl_data["crawl_ms"] = int(total_elapsed * 1000)

        logger.info(
            f"Crawl complete url={url} "
            f"total={total_elapsed:.1f}s "
            f"html_static={len(crawl_data['html_static'])} "
            f"html_rendered={len(crawl_data['html_rendered'])} "
            f"error={crawl_data['error']}"
        )

        return crawl_data