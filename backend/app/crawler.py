from playwright.async_api import async_playwright
import httpx
import time
 
class SiteCrawler:
    """Crawls a URL and returns raw data for all 8 checks."""
 
    def __init__(self, timeout_ms: int = 30000):
        self.timeout_ms = timeout_ms
 
    async def crawl(self, url: str) -> dict:
        """
        Returns a dict with all raw data needed by the scoring engine.
        Single page crawl - we only check the URL provided.
        """
        start = time.time()
        result = {
            "url": url,
            "html_static": "",      # HTML without JS
            "html_rendered": "",    # HTML with JS (Playwright)
            "robots_txt": "",
            "llms_txt": "",
            "sitemap_xml": "",
            "mcp_endpoint": None,
            "performance": {},
            "status_code": None,
            "error": None,
        }
 
        base_url = self._get_base_url(url)
 
        # Fetch static content and auxiliary files in parallel
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            import asyncio
            tasks = [
                client.get(url),
                client.get(f"{base_url}/robots.txt"),
                client.get(f"{base_url}/llms.txt"),
                client.get(f"{base_url}/sitemap.xml"),
                client.get(f"{base_url}/.well-known/mcp"),
            ]
            responses = await asyncio.gather(*tasks, return_exceptions=True)
 
            if not isinstance(responses[0], Exception):
                result["html_static"] = responses[0].text
                result["status_code"] = responses[0].status_code
            if not isinstance(responses[1], Exception) and responses[1].status_code == 200:
                result["robots_txt"] = responses[1].text
            if not isinstance(responses[2], Exception) and responses[2].status_code == 200:
                result["llms_txt"] = responses[2].text
            if not isinstance(responses[3], Exception) and responses[3].status_code == 200:
                result["sitemap_xml"] = responses[3].text
            if not isinstance(responses[4], Exception) and responses[4].status_code == 200:
                result["mcp_endpoint"] = responses[4].text
 
        # JS-rendered HTML via Playwright
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
 
                perf_start = time.time()
                await page.goto(url, wait_until="networkidle",
                                timeout=self.timeout_ms)
                ttfb_ms = int((time.time() - perf_start) * 1000)
 
                result["html_rendered"] = await page.content()
                result["performance"] = {
                    "ttfb_ms": ttfb_ms,
                    "title": await page.title(),
                }
                await browser.close()
        except Exception as e:
            result["error"] = f"Playwright error: {str(e)}"
 
        result["crawl_time_ms"] = int((time.time() - start) * 1000)
        return result
 
    def _get_base_url(self, url: str) -> str:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"