# backend/app/checks/speed.py
from ..schemas import CheckResult
 
 
async def check_speed(performance: dict) -> CheckResult:
    """
    Check page load speed from Playwright performance timing.
    performance dict comes from crawler.py and contains:
      - ttfb_ms: time to first byte in milliseconds
      - load_ms: total page load time in milliseconds (optional)
    """
    if not performance or "ttfb_ms" not in performance:
        return CheckResult(
            name="Page Load Speed",
            score=5, max_score=10, passed=False, partial=True,
            description="Checks page speed to assess AI agent timeout risk.",
            finding="Could not measure page load speed. Assuming moderate performance.",
            fix="Optimise your hosting and reduce page weight to ensure AI agents do not time out.",
            details={"measured":False}
        )
 
    ttfb_ms = performance.get("ttfb_ms", 9999)
    load_ms = performance.get("load_ms", ttfb_ms)
 
    # Score based on load time
    if load_ms <= 2000 and ttfb_ms <= 500:
        score, passed, partial = 10, True, False
        finding = f"Fast load time: {load_ms}ms total, {ttfb_ms}ms TTFB. Low agent timeout risk."
    elif load_ms <= 4000 and ttfb_ms <= 1500:
        score, passed, partial = 5, False, True
        finding = f"Moderate load time: {load_ms}ms total, {ttfb_ms}ms TTFB. Some agent timeout risk."
    else:
        score, passed, partial = 0, False, False
        finding = f"Slow load time: {load_ms}ms total, {ttfb_ms}ms TTFB. High agent timeout risk."
 
    fix_map = {
        True:  "Good page speed. Monitor with PageSpeed Insights regularly.",
        False: "Optimise: compress images, enable CDN (Cloudflare free tier), reduce JS bundles, upgrade hosting plan.",
    }
 
    return CheckResult(
        name="Page Load Speed",
        score=score, max_score=10,
        passed=passed, partial=partial,
        description="Checks page load speed. AI agents time out on slow sites and move to faster competitors.",
        finding=finding,
        fix=fix_map[passed],
        details={"ttfb_ms":ttfb_ms,"load_ms":load_ms,"measured":True}
    )
