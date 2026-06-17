from ..schemas import CheckResult

async def check_rendering(html_static: str, html_rendered: str) -> CheckResult:
    """Compares static vs rendered HTML length to detect JS rendering dependency."""
    if not html_static or not html_rendered:
        return CheckResult(
            name="JavaScript Rendering Dependency",
            score=0, max_score=10, passed=False,
            description="Checks if the page hides content behind client-side JavaScript rendering.",
            finding="Unable to read page content (static or rendered HTML is empty).",
            fix="Ensure your server returns HTML content that does not require JavaScript to render.",
            details={"static_bytes": 0, "rendered_bytes": 0, "ratio": 0}
        )

    static_len = len(html_static.strip())
    rendered_len = len(html_rendered.strip())
    ratio = static_len / max(rendered_len, 1)

    if ratio >= 0.7:
        score, passed, partial = 10, True, False
        finding = f"Content is accessible without JavaScript. Static-to-rendered ratio: {ratio:.2f}."
    elif ratio >= 0.3:
        score, passed, partial = 5, False, True
        finding = f"Some content is hidden behind client-side JS. Static-to-rendered ratio: {ratio:.2f}."
    else:
        score, passed, partial = 0, False, False
        finding = f"Page relies heavily on client-side JavaScript. Static-to-rendered ratio: {ratio:.2f}."

    return CheckResult(
        name="JavaScript Rendering Dependency",
        score=score, max_score=10, passed=passed, partial=partial,
        description="Measures static server HTML against rendered HTML to detect client-side JS dependency.",
        finding=finding,
        fix="Use server-side rendering (SSR) or prerendering to expose content without JavaScript.",
        details={"static_bytes": static_len, "rendered_bytes": rendered_len, "ratio": round(ratio, 4)}
    )
