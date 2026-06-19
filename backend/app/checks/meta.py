# backend/app/checks/meta.py
from bs4 import BeautifulSoup
from ..schemas import CheckResult
 
 
def extract_meta(html: str) -> dict:
    """Extract all relevant meta tags from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    head = soup.find("head") or soup
 
    result = {
        "title":          None,
        "description":    None,
        "og_title":       None,
        "og_description": None,
        "og_type":        None,
        "canonical":      None,
        "og_image":       None,  # bonus, not scored
    }
 
    # Title tag
    title_tag = head.find("title")
    if title_tag:
        result["title"] = title_tag.get_text(strip=True)
 
    # Meta tags
    for meta in head.find_all("meta"):
        name    = (meta.get("name",    "") or "").lower()
        prop    = (meta.get("property","") or "").lower()
        content = meta.get("content",  "") or ""
 
        if name == "description":
            result["description"] = content
        elif prop == "og:title":
            result["og_title"] = content
        elif prop == "og:description":
            result["og_description"] = content
        elif prop == "og:type":
            result["og_type"] = content
        elif prop == "og:image":
            result["og_image"] = content
 
    # Canonical link
    canonical = head.find("link", rel=lambda r: r and "canonical" in r)
    if canonical:
        result["canonical"] = canonical.get("href","")
 
    return result
 
 
async def check_meta(html: str) -> CheckResult:
    """Check meta tags and Open Graph for AI engine visibility."""
    if not html:
        return CheckResult(
            name="Meta Tags and Open Graph",
            score=0, max_score=10, passed=False,
            description="Checks for meta tags and Open Graph data used by AI engines.",
            finding="No HTML content available to analyse.",
            fix="Ensure your page returns valid HTML.",
            details={}
        )
 
    tags = extract_meta(html)
    score = 0
    issues = []
    present = []
 
    # Title (2 pts)
    if tags["title"] and len(tags["title"]) >= 10:
        score += 2
        present.append("title")
    else:
        issues.append("missing or too-short title tag")
 
    # Meta description (3 pts)
    if tags["description"] and len(tags["description"]) >= 50:
        score += 3
        present.append("meta description")
    elif tags["description"] and len(tags["description"]) >= 20:
        score += 1
        issues.append("meta description too short (under 50 chars)")
    else:
        issues.append("missing meta description")
 
    # OG title (1 pt)
    if tags["og_title"]:
        score += 1
        present.append("og:title")
    else:
        issues.append("missing og:title")
 
    # OG description (2 pts)
    if tags["og_description"] and len(tags["og_description"]) >= 30:
        score += 2
        present.append("og:description")
    elif tags["og_description"]:
        score += 1
        issues.append("og:description too short")
    else:
        issues.append("missing og:description")
 
    # OG type (1 pt)
    if tags["og_type"]:
        score += 1
        present.append("og:type")
    else:
        issues.append("missing og:type")
 
    # Canonical (1 pt)
    if tags["canonical"]:
        score += 1
        present.append("canonical")
    else:
        issues.append("missing canonical link tag")
 
    passed  = score >= 10
    partial = 5 <= score < 10
 
    if not issues:
        finding = f"All meta tags present and complete: {', '.join(present)}."
    else:
        finding = f"Missing or incomplete: {', '.join(issues[:3])}."
 
    return CheckResult(
        name="Meta Tags and Open Graph",
        score=score, max_score=10,
        passed=passed, partial=partial,
        description="Checks for title, meta description, and Open Graph tags used by AI engines to understand page context.",
        finding=finding,
        fix="Add missing tags to your HTML <head>. Use a plugin (Yoast for WordPress, built-in for Webflow) to manage meta tags.",
        details={"tags":tags,"present":present,"issues":issues}
    )
