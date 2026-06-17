from bs4 import BeautifulSoup
from ..schemas import CheckResult

async def check_sitemap(sitemap_xml: str) -> CheckResult:
    """Parses sitemap XML for valid <loc> tags using BeautifulSoup with the XML parser."""
    if not sitemap_xml or not sitemap_xml.strip():
        return CheckResult(
            name="Sitemap.xml Presence",
            score=0, max_score=5, passed=False,
            description="Checks for a sitemap.xml file containing valid <loc> entries.",
            finding="No sitemap.xml content provided (404 or empty).",
            fix="Generate a sitemap.xml and expose it at /sitemap.xml on your site.",
            details={"url_count": 0}
        )

    try:
        soup = BeautifulSoup(sitemap_xml, "xml")
        locs = soup.find_all("loc")
        url_count = len(locs)

        if url_count > 0:
            return CheckResult(
                name="Sitemap.xml Presence",
                score=5, max_score=5, passed=True,
                description="Checks for a sitemap.xml file containing valid <loc> entries.",
                finding=f"Valid sitemap found with {url_count} URL(s) indexed.",
                fix="Keep your sitemap automatically regenerated as you add new pages.",
                details={"url_count": url_count}
            )
        else:
            return CheckResult(
                name="Sitemap.xml Presence",
                score=2, max_score=5, passed=False, partial=True,
                description="Checks for a sitemap.xml file containing valid <loc> entries.",
                finding="Sitemap file exists but contains no <loc> entries.",
                fix="Populate your sitemap with valid <loc> tags pointing to your site pages.",
                details={"url_count": 0}
            )
    except Exception as e:
        return CheckResult(
            name="Sitemap.xml Presence",
            score=0, max_score=5, passed=False,
            description="Checks for a sitemap.xml file containing valid <loc> entries.",
            finding=f"Could not parse sitemap XML: {str(e)}",
            fix="Ensure your sitemap is valid XML with proper <urlset> and <loc> tags.",
            details={"error": str(e)}
        )
