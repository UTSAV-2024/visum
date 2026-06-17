from ..schemas import CheckResult

async def check_speed(performance_data: dict) -> CheckResult:
    """Evaluates page load speed based on TTFB (Time-to-First-Byte)."""
    ttfb = None

    if isinstance(performance_data, dict):
        ttfb = performance_data.get("ttfb_ms")

    if ttfb is None:
        return CheckResult(
            name="Page Load Speed",
            score=0, max_score=10, passed=False,
            description="Measures Time-to-First-Byte (TTFB) to evaluate server response speed.",
            finding="No performance data available (ttfb_ms key missing or empty).",
            fix="Optimize your server response times and use a CDN for faster delivery.",
            details={"ttfb_ms": None}
        )

    if ttfb <= 500:
        score, passed, partial = 10, True, False
        finding = f"Fast server response. Time-to-First-Byte: {ttfb}ms."
    elif ttfb <= 1500:
        score, passed, partial = 5, False, True
        finding = f"Moderate server response time. Time-to-First-Byte: {ttfb}ms."
    else:
        score, passed, partial = 0, False, False
        finding = f"Slow server response. Time-to-First-Byte: {ttfb}ms."

    return CheckResult(
        name="Page Load Speed",
        score=score, max_score=10, passed=passed, partial=partial,
        description="Measures Time-to-First-Byte (TTFB) to evaluate server response speed.",
        finding=finding,
        fix="Use a CDN, enable caching, and optimize your server infrastructure.",
        details={"ttfb_ms": ttfb}
    )
