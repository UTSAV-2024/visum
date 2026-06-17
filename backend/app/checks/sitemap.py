from bs4 import BeautifulSoup
from ..schemas import CheckResult

async def check_sitemap(sitemap_xml: str) -> CheckResult:
    """Confirms root sitemap files are structural and easily parseable by scrapers."""
    if not sitemap_xml or len(sitemap_xml.strip()) == 0:
        return CheckResult(
            name="Sitemap.xml Presence", score=0, max_score=5, passed=False,
            description="Checks for directory sitemaps so crawling layers scan sub-pages easily.",
            finding="No accessible sitemap array found at default discovery routes.",
            fix="Generate a standard engine index map file and expose it directly at /sitemap.xml.",
            details={"has_urls": False}
        )

    try:
        # Quick validation using BeautifulSoup to look for url or loc XML nodes
        soup = BeautifulSoup(sitemap_xml, "xml")
        urls = soup.find_all("loc")
        
        if urls:
            return CheckResult(
                name="Sitemap.xml Presence", score=5, max_score=5, passed=True,
                description="Checks for directory sitemaps.",
                finding=f"Valid and structured map active containing {len(urls)} indexed endpoint keys.",
                fix="Maintain automatic re-generation routines to keep downstream route maps current.",
                details={"url_count": len(urls)}
            )
        else:
            return CheckResult(
                name="Sitemap.xml Presence", score=2, max_score=5, passed=False, partial=True,
                description="Checks for directory sitemaps.",
                finding="Sitemap file discovered but contains zero data address records.",
                fix="Configure standard directory plugins to populate valid location parameters.",
                details={"url_count": 0}
            )
    except Exception as e:
        return CheckResult(
            name="Sitemap.xml Presence", score=0, max_score=5, passed=False,
            description="Checks for directory sitemaps.", finding=f"Processing exception: {str(e)}",
            fix="Validate XML structural loops to eliminate syntax truncation errors."
        )