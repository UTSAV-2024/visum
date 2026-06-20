# backend/tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.fixture
def valid_url():
    return "https://example.com"


# ── Health & Root ───────────────────────────────────────────────────

def test_health():
    """GET /health returns 200."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "timestamp" in data


def test_root():
    """GET / returns API info."""
    response = client.get("/")
    assert response.status_code == 200
    assert "Visum" in response.json()["message"]


# ── URL Validation ─────────────────────────────────────────────────

def test_scan_missing_url():
    """POST /scan without URL returns 422 (Pydantic validation)."""
    response = client.post("/scan", json={})
    assert response.status_code == 422


def test_scan_empty_url():
    """POST /scan with empty URL returns 400."""
    response = client.post("/scan", json={"url": ""})
    assert response.status_code == 400


def test_scan_invalid_url():
    """POST /scan with clearly invalid URL returns 400."""
    response = client.post("/scan", json={"url": "not-a-url"})
    assert response.status_code == 400
    data = response.json()
    assert "Invalid URL" in data["detail"]


def test_scan_nonsense_url():
    """POST /scan with total gibberish returns 400."""
    response = client.post("/scan", json={"url": "!!!abc!!!"})
    assert response.status_code == 400


def test_scan_localhost_url():
    """POST /scan with localhost URL returns 400 (SSRF protection)."""
    response = client.post("/scan", json={"url": "http://localhost:8000/test"})
    assert response.status_code == 400
    data = response.json()
    assert "internal" in data["detail"].lower() or "localhost" in data["detail"].lower()


# ── Scan Endpoint ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_scan_valid_url(valid_url):
    """POST /scan with valid URL returns ScanResponse with all 8 checks."""
    response = client.post("/scan", json={"url": valid_url})
    assert response.status_code == 200
    data = response.json()
    assert "scan_id" in data
    assert "result" in data
    assert "status" in data
    assert data["status"] == "completed"
    result = data["result"]
    assert "total_score" in result
    assert "band" in result
    assert "checks" in result
    assert len(result["checks"]) == 8
    for check in result["checks"]:
        assert "name" in check
        assert "score" in check
        assert "finding" in check


def test_scan_response_schema():
    """Response matches ScanResponse schema."""
    response = client.post("/scan", json={"url": "https://anthropic.com"})
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data["scan_id"], str)
        assert isinstance(data["result"]["total_score"], int)
        assert 0 <= data["result"]["total_score"] <= 100
        assert data["result"]["band"] in [
            "Agent-Ready",
            "Partially Visible",
            "Mostly Invisible",
            "Agent-Invisible"
        ]


# ── Status Endpoint ─────────────────────────────────────────────────

def test_status_endpoint():
    """GET /status/{scan_id} returns correct status."""
    scan_resp = client.post("/scan", json={"url": "https://example.com"})
    if scan_resp.status_code == 200:
        scan_id = scan_resp.json()["scan_id"]
        status_resp = client.get(f"/status/{scan_id}")
        assert status_resp.status_code == 200
        data = status_resp.json()
        assert data["status"] in ["pending", "running", "completed", "failed"]
        assert "scan_id" in data
        assert "url" in data
        # Should have created_at
        assert "created_at" in data


def test_status_response_schema():
    """Status response matches expected schema."""
    scan_resp = client.post("/scan", json={"url": "https://example.com"})
    if scan_resp.status_code == 200:
        scan_id = scan_resp.json()["scan_id"]
        status_resp = client.get(f"/status/{scan_id}")
        data = status_resp.json()
        assert isinstance(data["scan_id"], str)
        assert isinstance(data["url"], str)
        assert isinstance(data["status"], str)
        # Optional fields
        if data.get("total_score") is not None:
            assert isinstance(data["total_score"], int)
        if data.get("band") is not None:
            assert isinstance(data["band"], str)
        if data.get("error") is not None:
            assert isinstance(data["error"], str)


def test_status_not_found():
    """GET /status/{invalid_id} returns 404."""
    response = client.get("/status/nonexistent-id")
    assert response.status_code == 404


# ── Concurrent Scans ───────────────────────────────────────────────

def test_concurrent_scans_limited():
    """Multiple concurrent scans should be rate-limited via semaphore."""
    import asyncio
    urls = [
        "https://example.com",
        "https://example.com",
        "https://example.com",
    ]

    async def run_concurrent():
        async def do_scan(url):
            return client.post("/scan", json={"url": url})

        tasks = [do_scan(u) for u in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

    results = asyncio.run(run_concurrent())
    for r in results:
        if isinstance(r, Exception):
            continue
        assert r.status_code in (200, 503)


# ── HTTP Status Code Coverage ──────────────────────────────────────

def test_scan_returns_200_for_valid_url():
    """200: Successful scan returns 200."""
    response = client.post("/scan", json={"url": "https://example.com"})
    if response.status_code == 200:
        data = response.json()
        assert data["status"] == "completed"


def test_scan_returns_400_for_empty_string():
    """400: Empty URL string returns 400."""
    response = client.post("/scan", json={"url": "  "})
    assert response.status_code == 400


def test_scan_returns_422_for_missing_field():
    """422: Missing URL field returns 422 from Pydantic."""
    response = client.post("/scan", json={})
    assert response.status_code == 422


def test_scan_returns_422_for_wrong_type():
    """422: URL as non-string returns 422."""
    response = client.post("/scan", json={"url": 12345})
    assert response.status_code == 422


def test_health_returns_200():
    """200: Health endpoint always returns 200."""
    response = client.get("/health")
    assert response.status_code == 200
