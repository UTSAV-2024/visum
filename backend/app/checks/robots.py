import httpx
from ..schemas import CheckResult
 
AI_BOTS = [
    "GPTBot",        # OpenAI
    "ClaudeBot",     # Anthropic
    "PerplexityBot", # Perplexity
    "Google-Extended",
    "anthropic-ai",
    "OAI-SearchBot",
]
 
async def check_robots(base_url: str) -> CheckResult:
    """Check robots.txt for AI crawler permissions."""
    robots_url = f"{base_url.rstrip('/')}/robots.txt"
    blocked_bots = []
    allowed_bots = []
    found = False
 
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(robots_url)
            if resp.status_code == 200:
                found = True
                content = resp.text
                lines = content.split("\n")
                current_agent = None
 
                for line in lines:
                    line = line.strip()
                    if line.lower().startswith("user-agent:"):
                        current_agent = line.split(":", 1)[1].strip()
                    elif line.lower().startswith("disallow:") and current_agent:
                        disallow_path = line.split(":", 1)[1].strip()
                        if disallow_path == "/" or disallow_path == "":
                            pass  # empty disallow = allow all
                        else:
                            # Check if this agent is an AI bot
                            for bot in AI_BOTS:
                                if bot.lower() in current_agent.lower() or current_agent == "*":
                                    if bot not in blocked_bots:
                                        blocked_bots.append(bot)
 
        # Determine score
        if not found:
            score, passed, partial = 0, False, False
            finding = "No robots.txt found (404). AI crawlers cannot determine your crawl rules."
        elif len(blocked_bots) == 0:
            score, passed, partial = 15, True, False
            finding = "All AI crawlers permitted. robots.txt is properly configured."
        elif len(blocked_bots) < len(AI_BOTS):
            score, passed, partial = 8, False, True
            finding = f"Some AI crawlers blocked: {', '.join(blocked_bots)}"
        else:
            score, passed, partial = 0, False, False
            finding = f"All major AI crawlers blocked: {', '.join(blocked_bots)}"
 
        return CheckResult(
            name="AI Bot Permissions (robots.txt)",
            score=score, max_score=15,
            passed=passed, partial=partial,
            description="Checks whether AI crawlers like GPTBot and ClaudeBot are permitted to crawl your site.",
            finding=finding,
            fix="Add 'User-agent: GPTBot\\nAllow: /' for each AI crawler to your robots.txt.",
            details={"blocked": blocked_bots, "url": robots_url, "found": found}
        )
    except Exception as e:
        return CheckResult(
            name="AI Bot Permissions (robots.txt)",
            score=0, max_score=15, passed=False,
            description="Checks AI crawler permissions in robots.txt.",
            finding=f"Could not fetch robots.txt: {str(e)}",
            fix="Ensure your robots.txt is publicly accessible at /robots.txt.",
            details={"error": str(e)}
        )