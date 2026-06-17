from ..schemas import CheckResult

async def check_rendering(html_static: str, html_rendered: str) -> CheckResult:
    """Compares text volume before and after client-side script compilation steps."""
    if not html_static or not html_rendered:
        return CheckResult(
            name="JavaScript Rendering Dependency", score=0, max_score=10, passed=False,
            description="Checks if raw page information is completely hidden behind JS execution boundaries.",
            finding="Unable to read text configurations to process string volume variations.",
            fix="Ensure your domain serves readable data payloads without hanging engine connections."
        )

    static_len = len(html_static.strip())
    rendered_len = len(html_rendered.strip())

    ratio = static_len / max(rendered_len, 1)

    if ratio >= 0.7:
        score, passed, partial = 10, True, False
        finding = f"Content accessible immediately without JS engines. Transmission Ratio: {ratio:.2f}."
    elif ratio >= 0.3:
        score, passed, partial = 5, False, True
        finding = f"Partial application information is locked behind local script processors. Ratio: {ratio:.2f}."
    else:
        score, passed, partial = 0, False, False
        finding = f"Critical data invisible without client-side engine evaluation steps. Ratio: {ratio:.2f}."

    return CheckResult(
        name="JavaScript Rendering Dependency", score=score, max_score=10, passed=passed, partial=partial,
        description="Measures static server HTML against executed script footprints to catch rendering blocks.",
        finding=finding, fix="Deploy server-side caching (SSR) or configure proxy routing channels to expose nodes.",
        details={"static_bytes": static_len, "rendered_bytes": rendered_len, "payload_ratio": ratio}
    )