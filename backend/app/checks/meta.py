from bs4 import BeautifulSoup
from ..schemas import CheckResult

ESSENTIAL_TAGS = [
    ("title", None),
    ("meta", {"name": "description"}),
    ("meta", {"property": "og:title"}),
    ("meta", {"property": "og:description"}),
]

async def check_meta(html_content: str) -> CheckResult:
    """Checks for essential meta tags: <title>, <meta name="description">, <meta property="og:title">, <meta property="og:description">."""
    if not html_content:
        return CheckResult(
            name="Meta Tags & Open Graph",
            score=0, max_score=10, passed=False,
            description="Checks for essential meta tags including title, description, and Open Graph tags.",
            finding="No HTML content provided to parse.",
            fix="Ensure your site returns HTML with proper <head> metadata.",
            details={"tags_found": 0, "tags_total": 4}
        )

    try:
        soup = BeautifulSoup(html_content, "html.parser")
        found_count = 0

        for tag_name, attrs in ESSENTIAL_TAGS:
            if attrs:
                if soup.find(tag_name, attrs=attrs):
                    found_count += 1
            else:
                if soup.find(tag_name):
                    found_count += 1

        if found_count == 4:
            score, passed, partial = 10, True, False
            finding = "All essential meta tags (title, description, og:title, og:description) are present."
        elif found_count >= 2:
            score, passed, partial = int(10 * found_count / 4), False, True
            finding = f"{found_count}/4 essential meta tags present."
        elif found_count == 1:
            score, passed, partial = int(10 * found_count / 4), False, True
            finding = "Only 1/4 essential meta tags found."
        else:
            score, passed, partial = 0, False, False
            finding = "No essential meta tags found in the HTML."

        return CheckResult(
            name="Meta Tags & Open Graph",
            score=score, max_score=10, passed=passed, partial=partial,
            description="Checks for essential meta tags including title, description, and Open Graph tags.",
            finding=finding,
            fix="Add <title>, <meta name=\"description\">, <meta property=\"og:title\">, and <meta property=\"og:description\"> to your HTML.",
            details={"tags_found": found_count, "tags_total": 4}
        )
    except Exception as e:
        return CheckResult(
            name="Meta Tags & Open Graph",
            score=0, max_score=10, passed=False,
            description="Checks for essential meta tags including title, description, and Open Graph tags.",
            finding=f"Error parsing HTML: {str(e)}",
            fix="Ensure your HTML is well-formed.",
            details={"error": str(e)}
        )
