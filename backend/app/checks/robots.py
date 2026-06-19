# backend/app/checks/robots.py
import httpx
import re
from ..schemas import CheckResult
 
# All AI crawlers to check - add new ones as they emerge
AI_BOTS = [
    "GPTBot",         # OpenAI Operator + ChatGPT browsing
    "OAI-SearchBot",  # OpenAI search crawler
    "ClaudeBot",      # Anthropic
    "anthropic-ai",   # Anthropic alternative
    "PerplexityBot",  # Perplexity AI
    "Google-Extended",# Google AI features
    "Bytespider",     # ByteDance / TikTok
    "CCBot",          # Common Crawl (many AI training sets)
]
 
def parse_robots(content: str) -> dict:
    """
    Parse robots.txt and return which AI bots are blocked/allowed.
    Returns: {bot_name: "blocked" | "allowed" | "partial"}
    """
    results = {}
    current_agents = []
    wildcard_disallows = []
 
    for raw_line in content.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
 
        if line.lower().startswith("user-agent:"):
            agent = line.split(":", 1)[1].strip()
            current_agents = [agent]
        elif line.lower().startswith("disallow:"):
            path = line.split(":", 1)[1].strip()
            for agent in current_agents:
                # Check if this agent is wildcard or an AI bot
                if agent == "*":
                    if path == "/":
                        wildcard_disallows.append(path)
                else:
                    for bot in AI_BOTS:
                        if bot.lower() in agent.lower():
                            if path == "/" or (path and len(path) > 0):
                                results[bot] = "blocked"
        elif line.lower().startswith("allow:"):
            path = line.split(":", 1)[1].strip()
            for agent in current_agents:
                for bot in AI_BOTS:
                    if bot.lower() in agent.lower():
                        if path == "/":
                            results[bot] = "allowed"
 
    return results, wildcard_disallows
 
 
async def check_robots(base_url: str, robots_content: str = "") -> CheckResult:
    """
    Check robots.txt for AI crawler permissions.
    robots_content is pre-fetched by the crawler. If empty, we fetch it here.
    """
    # Fetch if not pre-fetched
    if not robots_content:
        try:
            robots_url = base_url.rstrip("/") + "/robots.txt"
            async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
                resp = await client.get(robots_url)
                if resp.status_code == 200:
                    robots_content = resp.text
        except Exception as e:
            return CheckResult(
                name="AI Bot Permissions (robots.txt)",
                score=0, max_score=15, passed=False, partial=False,
                description="Checks whether AI crawlers are permitted in robots.txt.",
                finding=f"Could not fetch robots.txt: {str(e)}",
                fix="Ensure robots.txt is accessible at yoursite.com/robots.txt",
                details={"error": str(e)}
            )
 
    # No robots.txt = agents use defaults = generally allowed
    # But we penalise because explicit permission is better practice
    if not robots_content:
        return CheckResult(
            name="AI Bot Permissions (robots.txt)",
            score=0, max_score=15, passed=False, partial=False,
            description="Checks whether AI crawlers are permitted in robots.txt.",
            finding="No robots.txt file found. AI crawlers cannot determine your crawl rules.",
            fix="Create a robots.txt file at yoursite.com/robots.txt. Add User-agent: GPTBot then Allow: / for each AI crawler.",
            details={"found": False}
        )
 
    bot_results, wildcard_disallows = parse_robots(robots_content)
    blocked = [bot for bot, status in bot_results.items() if status == "blocked"]
    explicitly_allowed = [bot for bot, status in bot_results.items() if status == "allowed"]
 
    # All wildcarded and no specific blocks = good
    all_wildcard_blocked = "/" in wildcard_disallows and len(blocked) == 0
 
    if all_wildcard_blocked:
        score, passed, partial = 0, False, False
        finding = "Wildcard Disallow: / blocks all crawlers including AI agents."
    elif len(blocked) == 0:
        score, passed, partial = 15, True, False
        finding = "All AI crawlers permitted. robots.txt is correctly configured."
    elif len(blocked) < 3:
        score, passed, partial = 8, False, True
        finding = f"Some AI crawlers blocked: {', '.join(blocked)}"
    else:
        score, passed, partial = 0, False, False
        finding = f"Multiple AI crawlers blocked: {', '.join(blocked)}"
 
    fix_lines = []
    for bot in blocked:
        fix_lines.append(f"User-agent: {bot} -> Allow: /")
    fix = ("Remove blocking rules for: " + ", ".join(blocked) + ". ") if blocked else ""
    fix += "Add explicit Allow: / for GPTBot, ClaudeBot, PerplexityBot."
 
    return CheckResult(
        name="AI Bot Permissions (robots.txt)",
        score=score, max_score=15,
        passed=passed, partial=partial,
        description="Checks whether AI crawlers (GPTBot, ClaudeBot, PerplexityBot etc.) are permitted to crawl your site.",
        finding=finding,
        fix=fix,
        details={"blocked": blocked, "allowed": explicitly_allowed,
                 "wildcard_disallows": wildcard_disallows,
                 "raw_results": bot_results}
    )
