# backend/test_pipeline.py
# Run: cd backend && python test_pipeline.py https://yoursite.com
 
import asyncio
import sys
import json
from app.crawler import SiteCrawler
from app.scorer  import run_scan
 
crawler = SiteCrawler(timeout_ms=30000)
 
async def run_pipeline(url: str):
    print(f"\nAgentReady Pipeline Test")
    print(f"URL: {url}")
    print("=" * 60)
 
    # Step 1: Crawl
    print("Step 1: Crawling...")
    crawl_data = await crawler.crawl(url)
    print(f"  Crawl complete in {crawl_data['crawl_ms']}ms")
    print(f"  Static HTML: {len(crawl_data['html_static'])} chars")
    print(f"  Rendered HTML: {len(crawl_data['html_rendered'])} chars")
    print(f"  robots.txt: {'found' if crawl_data['robots_txt'] else 'not found'}")
    print(f"  llms.txt: {'found' if crawl_data['llms_txt'] else 'not found'}")
    print(f"  sitemap.xml: {'found' if crawl_data['sitemap_xml'] else 'not found'}")
    print(f"  MCP endpoint: {'found' if crawl_data['mcp_response'] else 'not found'}")
    if crawl_data.get("error"):
        print(f"  WARNING: {crawl_data['error']}")
 
    # Step 2: Score
    print("\nStep 2: Running all 8 checks...")
    result = await run_scan(crawl_data)
 
    # Step 3: Display
    print(f"\nRESULTS FOR: {result.url}")
    print(f"TOTAL SCORE: {result.total_score}/100")
    print(f"BAND: {result.band}")
    print(f"MESSAGE: {result.band_message}")
    print(f"\nCHECK BREAKDOWN:")
    print("-" * 60)
    for check in result.checks:
        status = "PASS" if check.passed else ("PART" if check.partial else "FAIL")
        bar = "#" * check.score + "." * (check.max_score - check.score)
        print(f"[{status}] {check.name:<35} {check.score:>2}/{check.max_score} [{bar}]")
        print(f"       {check.finding[:80]}")
    print("-" * 60)
    print(f"SCAN TIME: {result.scan_time_ms}ms")
    print(f"CTA: {result.upgrade_cta}")
 
    return result
 
 
if __name__ == "__main__":
    urls = sys.argv[1:] if len(sys.argv) > 1 else ["https://example.com"]
    for url in urls:
        asyncio.run(run_pipeline(url))
