# backend/tests/test_scorer.py
"""Tests for run_scan aggregation, focusing on honest handling of
checks that could not be measured (e.g. Playwright unavailable)."""
import pytest
from app.scorer import run_scan


def _base_crawl_data(**overrides):
    """A crawl_data dict that yields a fully measurable scan."""
    data = {
        "url": "https://example.com",
        "base_url": "https://example.com",
        "html_static": "<html><head><title>Example Domain Home</title>"
                       "<meta name='description' content='A sufficiently long meta description for scoring purposes here.'>"
                       "</head><body><p>Hello world content that is server rendered.</p></body></html>",
        "html_rendered": "<html><head><title>Example Domain Home</title>"
                         "<meta name='description' content='A sufficiently long meta description for scoring purposes here.'>"
                         "</head><body><p>Hello world content that is server rendered.</p></body></html>",
        "robots_txt": "User-agent: *\nAllow: /",
        "llms_txt": "",
        "sitemap_xml": "",
        "mcp_response": None,
        "performance": {"ttfb_ms": 200, "load_ms": 1200},
        "js_rendered": True,
        "status_code": 200,
    }
    data.update(overrides)
    return data


@pytest.mark.asyncio
async def test_total_score_in_range():
    result = await run_scan(_base_crawl_data())
    assert 0 <= result.total_score <= 100
    assert result.max_score == 100


@pytest.mark.asyncio
async def test_all_checks_measured_normalizes_to_raw_sum():
    """When every check is measured, the normalised total equals the raw sum
    of measured scores (maxes sum to 100 in that path)."""
    result = await run_scan(_base_crawl_data())
    measured = [c for c in result.checks if c.measured]
    assert all(c.measured for c in result.checks)  # nothing excluded here
    earned = sum(c.score for c in measured)
    available = sum(c.max_score for c in measured)
    assert result.total_score == round(earned / available * 100)


@pytest.mark.asyncio
async def test_unmeasured_checks_excluded_from_total():
    """When Playwright is unavailable, JS Rendering and Page Load Speed are
    reported as not-measured and must not drag the score down. The score is
    computed only over what we could measure."""
    data = _base_crawl_data(js_rendered=False, performance={})
    result = await run_scan(data)

    rendering = next(c for c in result.checks if c.name == "JavaScript Rendering")
    speed = next(c for c in result.checks if c.name == "Page Load Speed")
    assert rendering.measured is False
    assert speed.measured is False

    measured = [c for c in result.checks if c.measured]
    earned = sum(c.score for c in measured)
    available = sum(c.max_score for c in measured)
    # Full maxes sum to 90 (MCP is a 10-pt bonus); minus the two 10-pt browser checks
    assert available == 70
    assert result.total_score == round(earned / available * 100)


@pytest.mark.asyncio
async def test_unmeasured_checks_are_disclosed_in_the_headline():
    """A normalised score over a subset of checks must say so.

    Regression: production (Playwright unavailable on Render) returned a
    confident "100/100 - Excellent" while 2 of 8 checks silently never ran. The
    per-check cards said "not measured", but nothing in the headline did.
    """
    result = await run_scan(_base_crawl_data(js_rendered=False, performance={}))

    assert result.unmeasured_count == 2
    assert "could not be measured" in result.band_message
    assert "JavaScript Rendering" in result.band_message
    assert "Page Load Speed" in result.band_message


@pytest.mark.asyncio
async def test_fully_measured_scan_has_no_disclosure_noise():
    """When everything was measured, don't clutter the message with a caveat."""
    result = await run_scan(
        _base_crawl_data(js_rendered=True, performance={"ttfb_ms": 117, "load_ms": 806})
    )
    assert result.unmeasured_count == 0
    assert "could not be measured" not in result.band_message


@pytest.mark.asyncio
async def test_unmeasured_never_scores_worse_than_counting_zeros():
    """Excluding an unmeasured check must never score worse than the naive
    alternative of counting it as an outright failure (phantom zero)."""
    unmeasured = await run_scan(_base_crawl_data(js_rendered=False, performance={}))

    measured = [c for c in unmeasured.checks if c.measured]
    earned = sum(c.score for c in measured)
    # Denominator if we had (wrongly) kept the two unmeasured 10-pt checks as 0/10
    denom_with_phantoms = sum(c.max_score for c in measured) + 20
    naive_with_zeros = round(earned / denom_with_phantoms * 100)

    assert unmeasured.total_score >= naive_with_zeros
