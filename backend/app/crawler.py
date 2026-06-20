# backend/app/crawler.py
import asyncio
import time
import logging
from urllib.parse import urlparse
import httpx
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)


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

    async def _fetch(self, client: httpx.AsyncClient, url: str) -> str:
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                return resp.text
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
        start = time.time()

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
        }

        # ── Step 1: Parallel httpx fetches ──────────────────────────────────
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

            logger.info(f"httpx done. html_static={len(crawl_data['html_static'])} robots={bool(crawl_data['robots_txt'])} sitemap={bool(crawl_data['sitemap_xml'])}")

        except Exception as e:
            logger.error(f"httpx phase failed: {e}")
            crawl_data["error"] = f"httpx: {str(e)}"

        # ── Step 2: Playwright JS render ────────────────────────────────────
        try:
            logger.info(f"Playwright starting for {url}")
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
                )
                page = await context.new_page()

                ttfb_ms = None
                load_start = time.time()

                async def on_response(response):
                    nonlocal ttfb_ms
                    if response.url.rstrip("/") == url.rstrip("/") and ttfb_ms is None:
                        ttfb_ms = int((time.time() - load_start) * 1000)

                page.on("response", on_response)

                await page.goto(
                    url,
                    wait_until="domcontentloaded",
                    timeout=self.timeout_ms
                )

                # Wait a bit for JS to hydrate after domcontentloaded
                await page.wait_for_timeout(2000)

                content = await page.content()
                load_ms = int((time.time() - load_start) * 1000)
                title = await page.title()

                await browser.close()

            crawl_data["html_rendered"] = content
            crawl_data["performance"] = {
                "ttfb_ms": ttfb_ms or load_ms,
                "load_ms": load_ms,
                "title": title,
            }

            logger.info(f"Playwright done. html_rendered={len(content)} load_ms={load_ms} title={title}")

        except Exception as e:
            logger.error(f"Playwright failed: {type(e).__name__}: {str(e)}")
            crawl_data["error"] = f"Playwright: {str(e)}"
            # Fallback: use static HTML for schema/meta checks
            if crawl_data["html_static"]:
                crawl_data["html_rendered"] = crawl_data["html_static"]
                logger.info(f"Fallback: using html_static ({len(crawl_data['html_static'])} chars) as html_rendered")

        crawl_data["crawl_ms"] = int((time.time() - start) * 1000)

        logger.info(
            f"crawl() returning: html_static={len(crawl_data['html_static'])} "
            f"html_rendered={len(crawl_data['html_rendered'])} "
            f"error={crawl_data['error']}"
        )

        return crawl_data