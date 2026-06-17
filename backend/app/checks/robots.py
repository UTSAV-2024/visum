from ..schemas import CheckResult

AI_BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot"]

async def check_robots(base_url: str, robots_content: str) -> CheckResult:
    """Checks robots.txt content for AI crawler blocks on GPTBot, ClaudeBot, PerplexityBot."""
    if not robots_content:
        return CheckResult(
            name="AI Bot Permissions (robots.txt)",
            score=0, max_score=15, passed=False,
            description="Checks whether AI crawlers like GPTBot and ClaudeBot are permitted to crawl your site.",
            finding="No robots.txt content provided (404 or empty).",
            fix="Add a robots.txt file to your site root permitting AI crawlers.",
            details={"blocked": [], "found": False}
        )

    lines = robots_content.split("\n")
    current_agent = None
    blocked_bots = []

    for line in lines:
        line = line.strip()
        if line.lower().startswith("user-agent:"):
            current_agent = line.split(":", 1)[1].strip()
        elif line.lower().startswith("disallow:") and current_agent:
            disallow_path = line.split(":", 1)[1].strip()
            if disallow_path == "/":
                for bot in AI_BOTS:
                    if bot.lower() == current_agent.lower() or current_agent == "*":
                        if bot not in blocked_bots:
                            blocked_bots.append(bot)

    blocked_count = len(blocked_bots)

    if blocked_count == 0:
        score, passed, partial = 15, True, False
        finding = "All AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are permitted."
    elif blocked_count == 1:
        score, passed, partial = 10, False, True
        finding = f"1 AI crawler blocked: {', '.join(blocked_bots)}."
    elif blocked_count == 2:
        score, passed, partial = 5, False, True
        finding = f"2 AI crawlers blocked: {', '.join(blocked_bots)}."
    else:
        score, passed, partial = 0, False, False
        finding = "All 3 AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are blocked."

    return CheckResult(
        name="AI Bot Permissions (robots.txt)",
        score=score, max_score=15,
        passed=passed, partial=partial,
        description="Checks whether AI crawlers like GPTBot and ClaudeBot are permitted to crawl your site.",
        finding=finding,
        fix="Add 'User-agent: GPTBot\nAllow: /' (and similarly for ClaudeBot and PerplexityBot) to your robots.txt.",
        details={"blocked": blocked_bots, "found": True}
    )
