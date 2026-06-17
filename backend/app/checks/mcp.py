import json
from ..schemas import CheckResult

async def check_mcp(mcp_content: str) -> CheckResult:
    """Tries to parse the content as valid JSON to determine if an MCP endpoint exists."""
    if not mcp_content:
        return CheckResult(
            name="Model Context Protocol (MCP) Endpoint",
            score=0, max_score=20, passed=False,
            description="Validates if your site exposes a Model Context Protocol endpoint for AI agents.",
            finding="No MCP endpoint content detected (empty or 404).",
            fix="Provision a hosted MCP endpoint so AI agents can interact with your site programmatically.",
            details={"mcp_active": False}
        )

    try:
        data = json.loads(mcp_content)
        keys = list(data.keys()) if isinstance(data, dict) else []
        return CheckResult(
            name="Model Context Protocol (MCP) Endpoint",
            score=20, max_score=20, passed=True,
            description="Validates if your site exposes a Model Context Protocol endpoint for AI agents.",
            finding="Valid JSON content detected -- MCP endpoint appears to be active.",
            fix="Monitor your MCP endpoint traffic and keep the schema updated.",
            details={"mcp_active": True, "top_level_keys": keys, "json_type": type(data).__name__}
        )
    except (json.JSONDecodeError, ValueError):
        return CheckResult(
            name="Model Context Protocol (MCP) Endpoint",
            score=0, max_score=20, passed=False,
            description="Validates if your site exposes a Model Context Protocol endpoint for AI agents.",
            finding="Content found but is not valid JSON -- MCP endpoint not properly configured.",
            fix="Ensure your MCP endpoint returns valid JSON with the correct protocol schema.",
            details={"mcp_active": False, "parse_error": True}
        )
