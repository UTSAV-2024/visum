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
    """No robots.txt = 0 score."""
    result = await check_robots("https://example.com", "")
    assert result.score == 0
    assert "No robots.txt" in result.finding
 
 
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
