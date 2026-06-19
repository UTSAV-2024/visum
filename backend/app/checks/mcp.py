# backend/app/checks/mcp.py
import httpx
import json
from ..schemas import CheckResult
 
# MCP protocol endpoints to probe
MCP_PATHS = [
    "/.well-known/mcp",
    "/mcp",
    "/api/mcp",
    "/.well-known/ai-plugin.json",  # OpenAI plugin manifest
]
 
# OpenAPI spec endpoints (partial credit)
OPENAPI_PATHS = [
    "/openapi.json",
    "/swagger.json",
    "/api-docs",
    "/api/openapi.json",
    "/docs/openapi.json",
]
 
 
def is_valid_mcp_response(content: str) -> bool:
    """Check if response looks like a valid MCP endpoint."""
    if not content:
        return False
    try:
        data = json.loads(content)
        # MCP responses typically have these fields
        mcp_indicators = ["tools", "resources", "prompts", "capabilities", "protocolVersion"]
        return any(key in data for key in mcp_indicators)
    except (json.JSONDecodeError, TypeError):
        # Could be SSE stream — check for MCP protocol keywords
        return "mcp" in content.lower()
 
 
def is_valid_openapi_response(content: str) -> bool:
    """Check if response looks like a valid OpenAPI spec."""
    if not content:
        return False
    try:
        data = json.loads(content)
        return "openapi" in data or "swagger" in data or "paths" in data
    except (json.JSONDecodeError, TypeError):
        return False
 
 
async def check_mcp(base_url: str, mcp_response: str = None) -> CheckResult:
    """
    Check for MCP endpoint or OpenAPI spec.
    mcp_response is pre-fetched by crawler for /.well-known/mcp path.
    We probe additional paths here.
    """
    # Check pre-fetched response first
    if mcp_response and is_valid_mcp_response(mcp_response):
        return CheckResult(
            name="MCP Endpoint",
            score=20, max_score=20, passed=True,
            description="Checks for a Model Context Protocol endpoint that lets AI agents query your site directly.",
            finding="MCP endpoint found at /.well-known/mcp. AI agents can query your products, inventory, and services directly.",
            fix="MCP endpoint active. Ensure your product catalog stays in sync.",
            details={"endpoint": "/.well-known/mcp", "type": "mcp"}
        )
 
    found_mcp = None
    found_openapi = None
 
    async with httpx.AsyncClient(timeout=8, follow_redirects=True) as client:
        # Probe MCP paths
        for path in MCP_PATHS:
            try:
                url = base_url.rstrip("/") + path
                resp = await client.get(url)
                if resp.status_code == 200:
                    if is_valid_mcp_response(resp.text):
                        found_mcp = path
                        break
            except Exception:
                continue
 
        # Probe OpenAPI paths if no MCP found
        if not found_mcp:
            for path in OPENAPI_PATHS:
                try:
                    url = base_url.rstrip("/") + path
                    resp = await client.get(url)
                    if resp.status_code == 200:
                        if is_valid_openapi_response(resp.text):
                            found_openapi = path
                            break
                except Exception:
                    continue
 
    if found_mcp:
        return CheckResult(
            name="MCP Endpoint",
            score=20, max_score=20, passed=True,
            description="Checks for an MCP endpoint that lets AI agents interact with your site.",
            finding=f"MCP endpoint found at {found_mcp}. AI agents can query your site directly.",
            fix="MCP endpoint active. Keep your product catalog and pricing in sync.",
            details={"endpoint": found_mcp, "type": "mcp"}
        )
    elif found_openapi:
        return CheckResult(
            name="MCP Endpoint",
            score=10, max_score=20, passed=False, partial=True,
            description="Checks for an MCP endpoint that lets AI agents interact with your site.",
            finding=f"OpenAPI spec found at {found_openapi}. Partial agent compatibility. No MCP endpoint detected.",
            fix="Add a proper MCP endpoint. AgentReady Pro provisions a hosted MCP server for your site automatically.",
            details={"endpoint": found_openapi, "type": "openapi"}
        )
    else:
        return CheckResult(
            name="MCP Endpoint",
            score=0, max_score=20, passed=False,
            description="Checks for an MCP endpoint that lets AI agents query your products and services directly.",
            finding="No MCP endpoint or OpenAPI spec found. AI agents cannot interact with your site programmatically. Shopify merchants have this built-in.",
            fix="AgentReady Pro provisions a hosted MCP server at agentready.io/m/your-slug. AI agents can then query your inventory, pricing, and FAQs in real time.",
            details={"endpoint": None, "type": None}
        )
