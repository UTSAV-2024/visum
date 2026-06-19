# backend/app/scorer.py - UPDATED Day 3
# Replaces the placeholder version from Day 1
 
import asyncio
import time
from datetime import datetime
from .schemas import ScanResult, CheckResult
# Day 2 checks
from .checks.robots    import check_robots
from .checks.schema_ld import check_schema_ld
from .checks.llms_txt  import check_llms_txt
from .checks.mcp       import check_mcp
# Day 3 checks
from .checks.rendering import check_rendering
from .checks.meta      import check_meta
from .checks.sitemap   import check_sitemap
from .checks.speed     import check_speed
 
 
SCORE_BANDS = [
    (85, "Agent-Ready",
     "Your site is well-optimised for AI agents. You are ahead of 90% of non-Shopify sites."),
    (65, "Partially Visible",
     "AI agents can find you but cannot interact effectively. Key gaps in MCP and structured data."),
    (40, "Mostly Invisible",
     "Most AI agents will skip your site. This is costing you AI traffic that converts 42% better than search."),
    (0,  "Agent-Invisible",
     "AI agents cannot read or interact with your site. Your Shopify competitors are fully visible to agents."),
]
 
 
def get_band(score: int) -> tuple:
    for threshold, label, msg in SCORE_BANDS:
        if score >= threshold:
            return label, msg
    return SCORE_BANDS[-1][1], SCORE_BANDS[-1][2]
 
 
def get_upgrade_cta(checks: list, score: int) -> str:
    """Return personalised upgrade CTA based on biggest gap."""
    if score < 40:
        return "AgentReady Pro fixes all critical gaps - MCP server, schema, and AI monitoring in one click."
    mcp = next((c for c in checks if "MCP" in c.name), None)
    if mcp and mcp.score == 0:
        return "Your biggest gap is the MCP endpoint. AgentReady Pro provisions a hosted MCP server for your site in minutes."
    schema = next((c for c in checks if "JSON-LD" in c.name), None)
    if schema and schema.score == 0:
        return "No structured data found. AgentReady Pro auto-generates JSON-LD schema from your site content."
    return "Upgrade to AgentReady Pro to add a hosted MCP server and weekly AI visibility monitoring."
 
 
async def run_scan(crawl_data: dict) -> ScanResult:
    """Run all 8 checks in parallel and return ScanResult."""
    t0  = time.time()
    url = crawl_data["url"]
 
    checks = await asyncio.gather(
        # Check 1: robots.txt (15 pts)
        check_robots(
            crawl_data["base_url"],
            crawl_data.get("robots_txt",""),
        ),
        # Check 2: JSON-LD schema (20 pts)
        check_schema_ld(crawl_data.get("html_rendered","")),
        # Check 3: llms.txt (10 pts)
        check_llms_txt(crawl_data.get("llms_txt","")),
        # Check 4: MCP endpoint (20 pts)
        check_mcp(
            crawl_data["base_url"],
            crawl_data.get("mcp_response"),
        ),
        # Check 5: JS rendering (10 pts)
        check_rendering(
            crawl_data.get("html_static",""),
            crawl_data.get("html_rendered",""),
        ),
        # Check 6: Meta tags (10 pts)
        check_meta(crawl_data.get("html_rendered","")),
        # Check 7: Sitemap (5 pts)
        check_sitemap(crawl_data.get("sitemap_xml","")),
        # Check 8: Speed (10 pts)
        check_speed(crawl_data.get("performance",{})),
    )
 
    total        = sum(c.score for c in checks)
    band, msg    = get_band(total)
    cta          = get_upgrade_cta(list(checks), total)
 
    return ScanResult(
        url=url,
        total_score=total,
        band=band,
        band_message=msg,
        checks=list(checks),
        scan_time_ms=int((time.time()-t0)*1000),
        timestamp=datetime.utcnow().isoformat(),
        upgrade_cta=cta,
    )
