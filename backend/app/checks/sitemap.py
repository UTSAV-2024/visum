import xml.etree.ElementTree as ET
from ..schemas import CheckResult
 
 
def parse_sitemap(content: str) -> dict:
    """Parse sitemap XML and extract key stats."""
    result = {"url_count":0,"has_lastmod":False,"is_index":False,"error":None}
    if not content or not content.strip():
        return result
    try:
        # Remove namespace for easier parsing
        clean = content.replace(
            'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',"")
        root = ET.fromstring(clean)
        tag  = root.tag.lower()
        if "sitemapindex" in tag:
            result["is_index"]  = True
            result["url_count"] = len(root.findall(".//sitemap"))
        else:
            urls = root.findall(".//url")
            result["url_count"]  = len(urls)
            result["has_lastmod"]= any(
                u.find("lastmod") is not None for u in urls)
    except ET.ParseError as e:
        result["error"] = str(e)
    return result
 
 
async def check_sitemap(sitemap_content: str = "") -> CheckResult:
    """Check for valid sitemap.xml."""
    if not sitemap_content:
        return CheckResult(
            name="Sitemap.xml",
            score=0, max_score=5, passed=False,
            description="Checks for sitemap.xml to help AI crawlers discover all pages on your site.",
            finding="No sitemap.xml found. AI crawlers may miss product and content pages.",
            fix="Generate a sitemap. WordPress: use Yoast SEO plugin. Webflow: generated automatically. Shopify: generated automatically.",
            details={"found":False}
        )
 
    parsed = parse_sitemap(sitemap_content)
 
    if parsed.get("error"):
        return CheckResult(
            name="Sitemap.xml",
            score=2, max_score=5, passed=False, partial=True,
            description="Checks for sitemap.xml.",
            finding=f"Sitemap found but XML is malformed: {parsed['error']}",
            fix="Fix your sitemap XML. Use a sitemap generator or plugin to regenerate it.",
            details={"found":True,"error":parsed["error"]}
        )
 
    if parsed["url_count"] == 0:
        return CheckResult(
            name="Sitemap.xml",
            score=2, max_score=5, passed=False, partial=True,
            description="Checks for sitemap.xml.",
            finding="Sitemap found but contains no URL entries.",
            fix="Regenerate your sitemap to include all pages.",
            details={"found":True,"url_count":0}
        )
 
    if parsed["has_lastmod"] or parsed["is_index"]:
        score, passed = 5, True
        finding = (f"Sitemap index with {parsed['url_count']} sub-sitemaps found." if parsed["is_index"]
                   else f"Valid sitemap with {parsed['url_count']} URLs and lastmod dates.")
    else:
        score, passed = 2, False
        finding = f"Sitemap found with {parsed['url_count']} URLs but no lastmod dates."
 
    return CheckResult(
        name="Sitemap.xml",
        score=score, max_score=5,
        passed=passed, partial=not passed,
        description="Checks for sitemap.xml to help AI crawlers discover all pages on your site.",
        finding=finding,
        fix="Add lastmod dates to your sitemap entries for better AI crawler prioritisation.",
        details={"found":True,"url_count":parsed["url_count"],
                 "has_lastmod":parsed["has_lastmod"],"is_index":parsed["is_index"]}
    )
