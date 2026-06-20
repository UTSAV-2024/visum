# backend/app/checks/rendering.py

from bs4 import BeautifulSoup
from ..schemas import CheckResult


def extract_visible_text(html: str) -> str:
    """Extract visible text content from HTML, ignoring scripts and styles."""
    if not html:
        return ""

    soup = BeautifulSoup(html, "html.parser")

    # Remove non-visible content
    for tag in soup(["script", "style", "noscript", "head", "meta", "link"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)

    # Collapse whitespace
    return " ".join(text.split())


def calculate_content_ratio(static_html: str, rendered_html: str) -> float:
    """
    Calculate ratio of static content vs rendered content.
    Returns float between 0.0 and 1.0.
    """
    static_text = extract_visible_text(static_html)
    rendered_text = extract_visible_text(rendered_html)

    # Neither static nor rendered content exists
    if not static_text and not rendered_text:
        return 0.0

    # No rendered content available
    if not rendered_text:
        return 0.0

    # Pure client-side rendering
    if not static_text:
        return 0.0

    ratio = len(static_text) / len(rendered_text)

    return min(ratio, 1.0)


async def check_rendering(static_html: str, rendered_html: str) -> CheckResult:
    """Check how much content is visible without JavaScript execution."""

    if not rendered_html:
        return CheckResult(
            name="JavaScript Rendering",
            score=5,
            max_score=10,
            passed=False,
            partial=True,
            description="Checks how much content AI crawlers can see without executing JavaScript.",
            finding="Could not obtain rendered HTML. Assuming partial JS dependency.",
            fix="Ensure your site returns meaningful HTML content server-side.",
            details={
                "ratio": None,
                "error": "no_rendered_html"
            }
        )

    static_text = extract_visible_text(static_html)
    rendered_text = extract_visible_text(rendered_html)

    static_words = len(static_text.split())
    rendered_words = len(rendered_text.split())

    # Critical fix:
    # If both are empty, do NOT award a perfect score.
    if static_words == 0 and rendered_words == 0:
        return CheckResult(
            name="JavaScript Rendering",
            score=0,
            max_score=10,
            passed=False,
            partial=False,
            description="Checks how much content AI crawlers can see without executing JavaScript. Many AI bots do not run JS.",
            finding="No content was extracted from either static or rendered HTML.",
            fix="Verify crawler output and HTML extraction logic.",
            details={
                "ratio": None,
                "static_words": 0,
                "rendered_words": 0,
                "error": "no_content_extracted"
            }
        )

    ratio = calculate_content_ratio(static_html, rendered_html)

    if ratio >= 0.7:
        score, passed, partial = 10, True, False
        finding = (
            f"Good server-side rendering. "
            f"Static HTML has {static_words} words, "
            f"rendered has {rendered_words} words "
            f"({ratio:.0%} ratio)."
        )

    elif ratio >= 0.3:
        score, passed, partial = 5, False, True
        finding = (
            f"Partial JS dependency. "
            f"Static HTML has {static_words} words, "
            f"rendered has {rendered_words} words "
            f"({ratio:.0%} ratio). "
            f"Some AI crawlers will miss content."
        )

    else:
        score, passed, partial = 0, False, False
        finding = (
            f"Heavy JS dependency. "
            f"Static HTML has only {static_words} words vs "
            f"{rendered_words} rendered "
            f"({ratio:.0%} ratio). "
            f"Non-JS AI crawlers see almost nothing."
        )

    fix = (
        "Your site renders well without JavaScript."
        if passed
        else "Consider server-side rendering (Next.js SSR, Nuxt SSR). AgentReady Pro MCP server bypasses this issue entirely."
    )

    return CheckResult(
        name="JavaScript Rendering",
        score=score,
        max_score=10,
        passed=passed,
        partial=partial,
        description="Checks how much content AI crawlers can see without executing JavaScript. Many AI bots do not run JS.",
        finding=finding,
        fix=fix,
        details={
            "ratio": round(ratio, 3),
            "static_words": static_words,
            "rendered_words": rendered_words
        }
    )