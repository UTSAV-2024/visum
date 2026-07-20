# backend/tests/test_checks.py
import pytest
from app.checks.robots import check_robots, parse_robots
from app.checks.schema_ld import check_schema_ld, extract_json_ld
from app.checks.llms_txt import check_llms_txt, parse_llms_txt
from app.checks.mcp import check_mcp, is_valid_mcp_response
 
 
# ── ROBOTS TESTS ────────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_robots_all_allowed():
    """No blocking rules = full score."""
    content = "User-agent: *\nAllow: /"
    result = await check_robots("https://example.com", content)
    assert result.score == 15
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_robots_gptbot_blocked():
    """Blocking GPTBot specifically = 0 or partial."""
    content = "User-agent: GPTBot\nDisallow: /"
    result = await check_robots("https://example.com", content)
    assert result.score <= 8
    assert result.passed == False
    assert "GPTBot" in result.finding
 
@pytest.mark.asyncio
async def test_robots_wildcard_blocked():
    """Wildcard Disallow: / = 0 score."""
    content = "User-agent: *\nDisallow: /"
    result = await check_robots("https://example.com", content)
    assert result.score == 0
 
@pytest.mark.asyncio
async def test_robots_missing():
    """No robots.txt = all crawlers allowed by default = near-full, passing score.

    Absence of robots.txt is not a block; the standard treats a missing file as
    'everything allowed'. It must not be scored as a failure.
    """
    result = await check_robots("https://example.com", "")
    assert result.score >= 13
    assert result.passed is True
    assert "No robots.txt" in result.finding
    assert "allowed by default" in result.finding
 
 
# ── SCHEMA TESTS ────────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_schema_valid_product():
    """Valid Product schema = 20 pts."""
    html = """<html><head>
    <script type="application/ld+json">
    {"@type": "Product", "name": "Test Widget",
     "offers": {"@type": "Offer", "price": "99.00"}}
    </script></head></html>"""
    result = await check_schema_ld(html)
    assert result.score == 20
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_schema_missing():
    """No JSON-LD = 0 pts."""
    html = "<html><body><p>Hello world</p></body></html>"
    result = await check_schema_ld(html)
    assert result.score == 0
    assert result.passed == False
 
@pytest.mark.asyncio
async def test_schema_incomplete():
    """Product schema missing required fields = partial."""
    html = """<html><head>
    <script type="application/ld+json">
    {"@type": "Product"}
    </script></head></html>"""
    result = await check_schema_ld(html)
    assert result.score <= 10
    assert result.partial == True
 
@pytest.mark.asyncio
async def test_schema_website_type():
    """WebSite schema = 15 pts (not high-value type)."""
    html = """<html><head>
    <script type="application/ld+json">
    {"@type": "WebSite", "name": "My Site", "url": "https://example.com"}
    </script></head></html>"""
    result = await check_schema_ld(html)
    assert result.score == 15
 
 
# ── LLMS.TXT TESTS ──────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_llms_valid():
    """Valid llms.txt = 10 pts."""
    content = """> My Project\n\nA great tool.\n\n## Docs\n\n- [API](https://example.com/api): API docs"""
    result = await check_llms_txt(content)
    assert result.score == 10
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_llms_missing():
    """No llms.txt = 0 pts."""
    result = await check_llms_txt("")
    assert result.score == 0
    assert result.passed == False

@pytest.mark.asyncio
async def test_llms_missing_says_not_found_not_incomplete():
    """Regression: an absent llms.txt must say 'No llms.txt file found',
    never 'found but incomplete'. A soft-404 (empty body) must not be treated
    as a present-but-partial file."""
    for empty in ("", "   ", "\n\n"):
        result = await check_llms_txt(empty)
        assert result.details.get("found") is False
        assert "No llms.txt file found" in result.finding
        assert "incomplete" not in result.finding.lower()
 
@pytest.mark.asyncio
async def test_llms_no_urls():
    """llms.txt with no URLs = partial."""
    content = "> My Project\n\nA description here."
    result = await check_llms_txt(content)
    assert result.score == 5
    assert result.partial == True
 
 
# ── MCP TESTS ───────────────────────────────────────────────────────
 
def test_mcp_response_valid():
    """Valid MCP JSON response detected correctly."""
    response = '{"tools": [], "protocolVersion": "2024-11-05"}'
    assert is_valid_mcp_response(response) == True
 
def test_mcp_response_invalid():
    """Non-MCP JSON not detected as MCP."""
    response = '{"error": "not found"}'
    assert is_valid_mcp_response(response) == False
 
@pytest.mark.asyncio
async def test_mcp_no_endpoint():
    """Site with no MCP = 0 pts."""
    # Use a known non-MCP site
    result = await check_mcp("https://example.com", None)
    assert result.score <= 10  # 0 or partial for OpenAPI
# Add these to backend/tests/test_checks.py
 
from app.checks.rendering import check_rendering, calculate_content_ratio
from app.checks.meta      import check_meta, extract_meta
from app.checks.sitemap   import check_sitemap, parse_sitemap
from app.checks.speed     import check_speed
 
 
# ── RENDERING TESTS ─────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_rendering_good_ssr():
    """Site with good SSR scores 10/10."""
    static = "<html><body><p>Product name</p><p>Price $99</p></body></html>"
    rendered = "<html><body><p>Product name</p><p>Price $99</p><p>Extra JS</p></body></html>"
    result = await check_rendering(static, rendered)
    assert result.score >= 8
 
@pytest.mark.asyncio
async def test_rendering_pure_spa():
    """Pure SPA with empty static HTML scores 0/10."""
    static   = "<html><body><div id=app></div></body></html>"
    rendered = "<html><body><div id=app><h1>Title</h1><p>Description</p></div></body></html>"
    result = await check_rendering(static, rendered)
    assert result.score <= 5

@pytest.mark.asyncio
async def test_rendering_no_js_render_is_not_measured():
    """When Playwright fell back to static HTML (js_rendered=False), the check
    must NOT fabricate a 10/10 by comparing static-vs-static. It is reported as
    not-measured and excluded from the total."""
    html = "<html><body><p>Same content both ways</p></body></html>"
    # Even with identical static == rendered (ratio would be 1.0 → fake 10/10)
    result = await check_rendering(html, html, js_rendered=False)
    assert result.measured is False
    assert result.score == 0
    assert result.passed is False
    assert "Not measured" in result.finding

@pytest.mark.asyncio
async def test_rendering_js_render_default_measured():
    """A normal render (js_rendered defaults True) is measured."""
    static = "<html><body><p>Product name</p><p>Price $99</p></body></html>"
    rendered = static
    result = await check_rendering(static, rendered)
    assert result.measured is True
 
 
# ── META TESTS ──────────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_meta_all_present():
    """All 6 meta tags present scores 10/10."""
    html = """<html><head>
    <title>Best Product Store - Buy Online</title>
    <meta name="description" content="The best products at the best prices. Shop now and save up to 50 percent.">
    <meta property="og:title" content="Best Product Store">
    <meta property="og:description" content="Shop the best products online.">
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://example.com">
    </head></html>"""
    result = await check_meta(html)
    assert result.score == 10
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_meta_missing_all():
    """No meta tags scores 0/10."""
    result = await check_meta("<html><body><p>Hello</p></body></html>")
    assert result.score == 0
 
 
# ── SITEMAP TESTS ───────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_sitemap_valid():
    """Valid sitemap with lastmod scores 5/5."""
    xml = """<?xml version="1.0"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://example.com</loc><lastmod>2026-01-01</lastmod></url>
    </urlset>"""
    result = await check_sitemap(xml)
    assert result.score == 5
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_sitemap_missing():
    """No sitemap scores 0/5."""
    result = await check_sitemap("")
    assert result.score == 0
 
 
# ── SPEED TESTS ─────────────────────────────────────────────────────
 
@pytest.mark.asyncio
async def test_speed_fast():
    """Fast page scores 10/10."""
    result = await check_speed({"ttfb_ms": 200, "load_ms": 1200})
    assert result.score == 10
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_speed_slow():
    """Slow page scores 0/10."""
    result = await check_speed({"ttfb_ms": 2000, "load_ms": 5000})
    assert result.score == 0
    assert result.passed == False
 
@pytest.mark.asyncio
async def test_speed_no_data():
    """Missing performance data must be reported as not-measured, not a
    fabricated partial score. It is excluded from the total instead."""
    result = await check_speed({})
    assert result.measured is False
    assert result.partial is False
    assert result.score == 0
    assert "Not measured" in result.finding
