from .schemas import ScanResult, CheckResult
from .checks.robots import check_robots
from .checks.schema_ld import check_schema_ld
from .checks.llms_txt import check_llms_txt
from .checks.mcp import check_mcp
from .checks.rendering import check_rendering
from .checks.meta import check_meta
from .checks.sitemap import check_sitemap
from .checks.speed import check_speed
import asyncio
from datetime import datetime
import uuid
 
SCORE_BANDS = [
    (85, "Agent-Ready",
     "Your site is well-optimized for AI agents. You are ahead of 90% of non-Shopify sites."),
    (65, "Partially Visible",
     "AI agents can find you but cannot interact effectively. Key gaps in MCP and structured data."),
    (40, "Mostly Invisible",
     "Most AI agents will skip your site. This is costing you AI traffic that converts 42% better than search."),
    (0,  "Agent-Invisible",
     "AI agents cannot read or interact with your site. Your Shopify competitors are fully visible to agents."),
]
 
def get_band(score: int):
    for threshold, label, msg in SCORE_BANDS:
        if score >= threshold:
            return label, msg
    return SCORE_BANDS[-1][1], SCORE_BANDS[-1][2]
 
def get_upgrade_cta(checks: list, score: int) -> str:
    """Return personalised upgrade CTA based on biggest gap."""
    if score < 40:
        return "AgentReady Pro fixes all critical gaps automatically — MCP server, schema, and AI monitoring in one click."
    mcp_check = next((c for c in checks if "MCP" in c.name), None)
    if mcp_check and mcp_check.score == 0:
        return "Your biggest gap is the MCP endpoint. AgentReady Pro provisions a hosted MCP server for your site in minutes."
    return "Upgrade to AgentReady Pro to add a hosted MCP server and weekly AI visibility monitoring."
 
async def run_scan(crawl_data: dict) -> ScanResult:
    """Run all 8 checks in parallel and return ScanResult."""
    import time
    start = time.time()
    url = crawl_data["url"]
    base_url = crawl_data.get("base_url", url)
 
    checks = await asyncio.gather(
        check_robots(base_url, crawl_data.get("robots_txt", "")),
        check_schema_ld(crawl_data.get("html_rendered", "")),
        check_llms_txt(crawl_data.get("llms_txt", "")),
        check_mcp(crawl_data.get("mcp_endpoint")),
        check_rendering(crawl_data.get("html_static", ""), crawl_data.get("html_rendered", "")),
        check_meta(crawl_data.get("html_rendered", "")),
        check_sitemap(crawl_data.get("sitemap_xml", "")),
        check_speed(crawl_data.get("performance", {})),
    )
 
    total = sum(c.score for c in checks)
    band, message = get_band(total)
    cta = get_upgrade_cta(checks, total)
 
    return ScanResult(
        url=url,
        total_score=total,
        band=band,
        band_message=message,
        checks=list(checks),
        scan_time_ms=int((time.time() - start) * 1000),
        timestamp=datetime.utcnow().isoformat(),
        upgrade_cta=cta,
    )