import pytest
from app.checks.robots import check_robots
from app.checks.schema_ld import check_schema_ld
 
@pytest.mark.asyncio
async def test_robots_blocked():
    """Sites blocking GPTBot should score 0."""
    robots_content = "User-agent: GPTBot\nDisallow: /"
    result = await check_robots("https://example.com", robots_content)
    assert result.score == 0
    assert result.passed == False
    assert "GPTBot" in result.finding
 
@pytest.mark.asyncio
async def test_robots_allowed():
    """Sites allowing all should score 15."""
    robots_content = "User-agent: *\nAllow: /"
    result = await check_robots("https://example.com", robots_content)
    assert result.score == 15
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_schema_valid_product():
    """Valid Product schema should score 20."""
    html = """<script type="application/ld+json">
    {"@type": "Product", "name": "Test", "offers": {"price": "99"}}
    </script>"""
    result = await check_schema_ld(html)
    assert result.score == 20
    assert result.passed == True
 
@pytest.mark.asyncio
async def test_schema_missing():
    """No schema should score 0."""
    result = await check_schema_ld("<html><body><p>Hello</p></body></html>")
    assert result.score == 0
    assert result.passed == False