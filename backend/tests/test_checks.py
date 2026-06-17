import pytest
from app.checks.robots import check_robots
from app.checks.schema_ld import check_schema_ld
from app.checks.llms_txt import check_llms_txt
from app.checks.mcp import check_mcp
from app.checks.rendering import check_rendering
from app.checks.meta import check_meta
from app.checks.sitemap import check_sitemap
from app.checks.speed import check_speed


@pytest.mark.asyncio
async def test_robots_perfect():
    """All AI crawlers permitted should score 15."""
    result = await check_robots(
        "https://example.com",
        "User-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /"
    )
    assert result.score == 15
    assert result.max_score == 15
    assert result.passed is True


@pytest.mark.asyncio
async def test_schema_ld_perfect():
    """Valid JSON-LD block with @type should score 20."""
    html = (
        '<html><head>'
        '<script type="application/ld+json">'
        '{"@type": "Organization", "name": "TestCorp"}'
        '</script>'
        '</head></html>'
    )
    result = await check_schema_ld(html)
    assert result.score == 20
    assert result.max_score == 20
    assert result.passed is True


@pytest.mark.asyncio
async def test_llms_txt_perfect():
    """llms.txt with H1 and >20 chars should score 10."""
    result = await check_llms_txt("# My Site\nThis is a test site for AI agent visibility.")
    assert result.score == 10
    assert result.max_score == 10
    assert result.passed is True


@pytest.mark.asyncio
async def test_mcp_perfect():
    """Valid JSON content should score 20."""
    result = await check_mcp('{"endpoint": "mcp://example.com", "version": "1.0"}')
    assert result.score == 20
    assert result.max_score == 20
    assert result.passed is True


@pytest.mark.asyncio
async def test_rendering_perfect():
    """Static content matching rendered content should score 10."""
    html_static = "<html><body>Hello world this is a test page for rendering</body></html>"
    html_rendered = "<html><body>Hello world this is a test page for rendering</body></html>"
    result = await check_rendering(html_static, html_rendered)
    assert result.score == 10
    assert result.max_score == 10
    assert result.passed is True


@pytest.mark.asyncio
async def test_meta_perfect():
    """All 4 essential meta tags present should score 10."""
    html = (
        '<html><head>'
        '<title>Test Site</title>'
        '<meta name="description" content="A test site description">'
        '<meta property="og:title" content="Test OG Title">'
        '<meta property="og:description" content="Test OG Description">'
        '</head></html>'
    )
    result = await check_meta(html)
    assert result.score == 10
    assert result.max_score == 10
    assert result.passed is True


@pytest.mark.asyncio
async def test_sitemap_perfect():
    """Sitemap with valid <loc> tags should score 5."""
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        '<url><loc>https://example.com/</loc></url>'
        '<url><loc>https://example.com/about</loc></url>'
        '</urlset>'
    )
    result = await check_sitemap(sitemap)
    assert result.score == 5
    assert result.max_score == 5
    assert result.passed is True


@pytest.mark.asyncio
async def test_speed_perfect():
    """TTFB <= 500ms should score 10."""
    result = await check_speed({"ttfb_ms": 150})
    assert result.score == 10
    assert result.max_score == 10
    assert result.passed is True
