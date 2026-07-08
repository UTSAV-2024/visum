# backend/app/scorer.py
import asyncio
import time
import logging
from datetime import datetime, timezone
from .schemas import ScanResult
from .checks.robots    import check_robots
from .checks.schema_ld import check_schema_ld
from .checks.llms_txt  import check_llms_txt
from .checks.mcp       import check_mcp
from .checks.rendering import check_rendering
from .checks.meta      import check_meta
from .checks.sitemap   import check_sitemap
from .checks.speed     import check_speed

logger = logging.getLogger(__name__)

SCORE_BANDS = [
    (85, "Excellent — AI Optimized",
     "Your site is well-prepared for AI discovery. Most AI systems can find, read, and understand your content."),
    (65, "Good — Needs Work",
     "AI systems can partially discover you, but gaps in structure and permissions limit how often you're cited."),
    (40, "Warning — Visibility Gaps",
     "Most AI systems struggle to access or understand your site. You're likely missing AI-driven traffic opportunities."),
    (0,  "Critical — Invisible to AI",
     "AI systems cannot reliably access or understand your site. You're likely invisible in AI search results and chatbot answers."),
]


def get_band(score: int) -> tuple:
    for threshold, label, msg in SCORE_BANDS:
        if score >= threshold:
            return label, msg
    return SCORE_BANDS[-1][1], SCORE_BANDS[-1][2]


def get_upgrade_cta(checks: list, score: int) -> str:
    if score < 40:
        return "Visum Pro helps you fix the most critical gaps faster. Get automated fixes for MCP, structured data, and AI monitoring."
    mcp = next((c for c in checks if "MCP" in c.name), None)
    if mcp and mcp.score == 0:
        return "An MCP endpoint lets AI agents query your content directly. Visum Pro sets this up for you."
    schema = next((c for c in checks if "JSON-LD" in c.name), None)
    if schema and schema.score == 0:
        return "Structured data helps AI systems understand your content. Visum Pro generates it from your existing pages."
    return "Visum Pro gives you weekly AI visibility monitoring and automated fixes for recurring issues."


async def run_scan(crawl_data: dict) -> ScanResult:
    t0 = time.time()
    url = crawl_data["url"]

    logger.info(
        f"run_scan: html_static={len(crawl_data.get('html_static',''))} "
        f"html_rendered={len(crawl_data.get('html_rendered',''))} "
        f"robots={bool(crawl_data.get('robots_txt'))} "
        f"sitemap={bool(crawl_data.get('sitemap_xml'))}"
    )

    checks = await asyncio.gather(
        check_robots(crawl_data["base_url"], crawl_data.get("robots_txt", "")),
        check_schema_ld(crawl_data.get("html_rendered", "")),
        check_llms_txt(crawl_data.get("llms_txt", "")),
        check_mcp(crawl_data["base_url"], crawl_data.get("mcp_response")),
        check_rendering(crawl_data.get("html_static", ""), crawl_data.get("html_rendered", "")),
        check_meta(crawl_data.get("html_rendered", "")),
        check_sitemap(crawl_data.get("sitemap_xml", "")),
        check_speed(crawl_data.get("performance", {})),
    )

    for c in checks:
        logger.info(f"  {c.name}: {c.score}/{c.max_score} | {c.finding[:60]}")

    total = sum(c.score for c in checks)
    band, msg = get_band(total)
    cta = get_upgrade_cta(list(checks), total)

    return ScanResult(
        url=url,
        total_score=total,
        band=band,
        band_message=msg,
        checks=list(checks),
        scan_time_ms=int((time.time() - t0) * 1000),
        timestamp=datetime.now(timezone.utc).isoformat(),
        upgrade_cta=cta,
    )