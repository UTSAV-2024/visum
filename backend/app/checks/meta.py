from bs4 import BeautifulSoup
from ..schemas import CheckResult

async def check_meta(html_content: str) -> CheckResult:
    """Examines meta components to track citation data structural elements."""
    if not html_content:
        return CheckResult(
            name="Meta Tags & Open Graph", score=0, max_score=10, passed=False,
            description="Validates metadata fields for descriptive summarization loops.",
            finding="Empty structural data layers encountered.", fix="Verify target HTML outputs load cleanly."
        )

    soup = BeautifulSoup(html_content, "html.parser")
    
    # Track essential elements
    has_title = bool(soup.find("title"))
    has_desc = bool(soup.find("meta", attrs={"name": "description"}))
    has_og_title = bool(soup.find("meta", property="og:title"))
    has_og_desc = bool(soup.find("meta", property="og:description"))
    has_og_type = bool(soup.find("meta", property="og:type"))
    has_canonical = bool(soup.find("link", rel="canonical"))

    tags = [has_title, has_desc, has_og_title, has_og_desc, has_og_type, has_canonical]
    found_count = sum(1 for tag in tags if tag)

    if found_count == 6:
        score, passed, partial = 10, True, False
        finding = "All core verification head components and tracking targets accounted for."
    elif found_count >= 3:
        score, passed, partial = 5, False, True
        finding = f"Basic content descriptors exist, but missing key metadata items ({found_count}/6)."
    else:
        score, passed, partial = 0, False, False
        finding = f"Inadequate document header structures located ({found_count}/6 fields populated)."

    return CheckResult(
        name="Meta Tags & Open Graph", score=score, max_score=10, passed=passed, partial=partial,
        description="Checks title tags, tracking definitions, canonical roots, and structured semantic headers.",
        finding=finding, fix="Populate complete meta descriptions and standard Open Graph entities inside your layout.",
        details={"tags_found": found_count, "has_canonical": has_canonical, "has_description": has_desc}
    )