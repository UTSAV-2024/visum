# backend/app/crawler.py
import asyncio
import time
from urllib.parse import urlparse
import httpx
from playwright.async_api import async_playwright
 
 
class SiteCrawler:
    """
    Crawls a URL and returns all raw data needed by the 8 scoring checks.
    Uses parallel httpx for auxiliary files + Playwright for JS rendering.
    """
 
    def __init__(self, timeout_ms: int = 30000):
        self.timeout_ms = timeout_ms
        self.http_timeout = 15  # seconds for httpx requests
 
    def get_base_url(self, url: str) -> str:
        """Extract scheme + netloc from full URL."""
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"
 
    def normalise_url(self, url: str) -> str:
        """Ensure URL has scheme."""
        url = url.strip()
        if not url.startswith(("http://","https://")):
            url = "https://" + url
        return url
 
    async def _fetch(self, client: httpx.AsyncClient, url: str) -> str:
        """Fetch a URL and return text. Returns empty string on failure."""
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                return resp.text
        except Exception:
            pass
        return ""
 
    async def _fetch_with_status(self, client: httpx.AsyncClient, url: str) -> tuple:
        """Fetch URL and return (text, status_code)."""
        try:
            resp = await client.get(url)
            return resp.text, resp.status_code
        except Exception as e:
            return "", 0
 
    async def crawl(self, url: str) -> dict:
        """
        Main crawl method. Returns structured dict with all data
        needed by all 8 scoring checks.
        """
        url      = self.normalise_url(url)
        base_url = self.get_base_url(url)
        start    = time.time()
 
        crawl_data = {
            "url":          url,
            "base_url":     base_url,
            "html_static":  "",
            "html_rendered":"",
            "robots_txt":   "",
            "llms_txt":     "",
            "sitemap_xml":  "",
            "mcp_response": None,
            "performance":  {},
            "status_code":  None,
            "crawl_ms":     0,
            "error":        None,
        }
 
        # ── Step 1: Parallel httpx fetches ─────────────────────────
        async with httpx.AsyncClient(
            timeout=self.http_timeout,
            follow_redirects=True,
            headers={"User-Agent": "AgentReadyBot/1.0"}
        ) as client:
            tasks = [
                self._fetch_with_status(client, url),
                self._fetch(client, f"{base_url}/robots.txt"),
                self._fetch(client, f"{base_url}/llms.txt"),
                self._fetch(client, f"{base_url}/sitemap.xml"),
                self._fetch(client, f"{base_url}/.well-known/mcp"),
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)
 
            # Unpack results safely
            if not isinstance(results[0], Exception):
                crawl_data["html_static"],  crawl_data["status_code"] = results[0]
            if not isinstance(results[1], Exception):
                crawl_data["robots_txt"]  = results[1]
            if not isinstance(results[2], Exception):
                crawl_data["llms_txt"]    = results[2]
            if not isinstance(results[3], Exception):
                crawl_data["sitemap_xml"] = results[3]
            if not isinstance(results[4], Exception) and results[4]:
                crawl_data["mcp_response"] = results[4]
 
        # ── Step 2: Playwright JS render + performance timing ───────
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    user_agent="AgentReadyBot/1.0 (compatible; crawler)"
                )
                page = await context.new_page()
 
                # Measure TTFB via response event
                ttfb_ms   = None
                load_start = time.time()
 
                async def on_response(response):
                    nonlocal ttfb_ms
                    # Strip trailing slashes to handle browser normalization
                    if response.url.rstrip("/") == url.rstrip("/") and ttfb_ms is None:
                        ttfb_ms = int((time.time() - load_start) * 1000)
 
                page.on("response", on_response)
 
                await page.goto(
                    url,
                    wait_until="networkidle",
                    timeout=self.timeout_ms
                )
                load_ms = int((time.time() - load_start) * 1000)
 
                crawl_data["html_rendered"] = await page.content()
                crawl_data["performance"]   = {
                    "ttfb_ms": ttfb_ms or load_ms,
                    "load_ms": load_ms,
                    "title":   await page.title(),
                }
 
                await browser.close()
 
        except Exception as e:
            crawl_data["error"] = f"Playwright: {str(e)}"
            # Don't fallback to static HTML — the rendering check handles empty input gracefully
            # meta and schema checks will score 0, which is honest when we can't render JS
 
        crawl_data["crawl_ms"] = int((time.time() - start) * 1000)
        return crawl_data
