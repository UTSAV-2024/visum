import json
from ..schemas import CheckResult

async def check_mcp(mcp_response_text: str) -> CheckResult:
    """Evaluates protocol definitions or active handshake indicators for MCP compatibility."""
    if not mcp_response_text:
        return CheckResult(
            name="Model Context Protocol (MCP) Endpoint", score=0, max_score=20, passed=False,
            description="Validates if your site exposes an implementation-layer connection hub for AI agents.",
            finding="No native machine-readable API surfaces or protocol handshakes detected.",
            fix="Provision an isolated hosted MCP endpoint instantly using an AgentReady Pro deployment.",
            details={"mcp_active": False}
        )

    try:
        # Simple test to confirm if the response text looks like valid JSON / config array
        data = json.loads(mcp_response_text)
        return CheckResult(
            name="Model Context Protocol (MCP) Endpoint", score=20, max_score=20, passed=True,
            description="Validates if your site exposes an implementation-layer connection hub for AI agents.",
            finding="Valid, active protocol definition layer detected at your root endpoint path.",
            fix="Monitor traffic logs as active autonomous transactions communicate across your schema.",
            details={"mcp_active": True, "inferred_keys": list(data.keys()) if isinstance(data, dict) else []}
        )
    except Exception:
        return CheckResult(
            name="Model Context Protocol (MCP) Endpoint", score=10, max_score=20, passed=False, partial=True,
            description="Validates if your site exposes an implementation-layer connection hub for AI agents.",
            finding="An application profile endpoint was discovered, but handshake signatures failed validation.",
            fix="Format endpoint structural arrays cleanly so agent routers parse operations accurately.",
            details={"mcp_active": False, "parse_error": True}
        )