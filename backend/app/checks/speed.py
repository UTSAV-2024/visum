from ..schemas import CheckResult

async def check_speed(performance_data: dict) -> CheckResult:
    """Evaluates metrics to minimize dropped connection risks during agent loops."""
    if not performance_data or "ttfb_ms" not in performance_data:
        return CheckResult(
            name="Page Load Speed", score=0, max_score=10, passed=False,
            description="Measures server timing parameters to evaluate engine connection timeout parameters.",
            finding="No processing performance timing configurations registered.",
            fix="Optimize application route structures to minimize blocking gateway drops."
        )

    ttfb = performance_data["ttfb_ms"]

    if ttfb <= 500:
        score, passed, partial = 10, True, False
        finding = f"Fast connection speed verified. Time-to-First-Byte clocked at {ttfb}ms."
    elif ttfb <= 1500:
        score, passed, partial = 5, False, True
        finding = f"Marginal server latency noticed. Time-to-First-Byte clocked at {ttfb}ms."
    else:
        score, passed, partial = 0, False, False
        finding = f"High connection timeout risk identified. Time-to-First-Byte is {ttfb}ms."

    return CheckResult(
        name="Page Load Speed", score=score, max_score=10, passed=passed, partial=partial,
        description="Measures Time-to-First-Byte (TTFB) performance metrics using headless runtime browsers.",
        finding=finding, fix="Leverage globally distributed caching networks (CDNs) to reduce server routing overhead.",
        details={"ttfb_latency_ms": ttfb}
    )