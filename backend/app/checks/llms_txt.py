from ..schemas import CheckResult

async def check_llms_txt(llms_content: str) -> CheckResult:
    """Validates the structure and layout of the root llms.txt file."""
    if not llms_content or len(llms_content.strip()) == 0:
        return CheckResult(
            name="llms.txt Discovery File", score=0, max_score=10, passed=False,
            description="Checks for an llms.txt file at your domain root for developer agent context.",
            finding="No llms.txt file was detected (404).",
            fix="Create a markdown file at /llms.txt summarizing your context for developer assistants.",
            details={"found": False}
        )

    # Basic structural check: look for markdown headings indicating a title/definition layout
    has_title = llms_content.startswith("# ") or "\n# " in llms_content
    
    if has_title and len(llms_content) > 20:
        return CheckResult(
            name="llms.txt Discovery File", score=10, max_score=10, passed=True,
            description="Checks for an llms.txt file at your domain root.",
            finding="Valid and clean llms.txt file found at your root domain directory.",
            fix="Keep your context file updated as your internal product surfaces or tools change.",
            details={"found": True, "char_length": len(llms_content)}
        )
    else:
        return CheckResult(
            name="llms.txt Discovery File", score=5, max_score=10, passed=False, partial=True,
            description="Checks for an llms.txt file at your domain root.",
            finding="An llms.txt file exists, but it appears malformed or lacks typical H1 headers.",
            fix="Format your llms.txt starting with an '# Project Title' string and markdown definitions.",
            details={"found": True, "char_length": len(llms_content)}
        )