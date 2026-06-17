from ..schemas import CheckResult

async def check_llms_txt(llms_content: str) -> CheckResult:
    """Checks if the content contains a Markdown H1 heading (# ) and is longer than 20 characters."""
    if not llms_content or not llms_content.strip():
        return CheckResult(
            name="llms.txt Discovery File",
            score=0, max_score=10, passed=False,
            description="Checks for an llms.txt file at your domain root for developer agent context.",
            finding="No llms.txt file was detected (404 or empty).",
            fix="Create a markdown file at /llms.txt with an H1 heading and summary of your site.",
            details={"found": False, "has_h1": False, "char_length": 0}
        )

    has_h1 = "# " in llms_content
    is_long_enough = len(llms_content.strip()) > 20

    if has_h1 and is_long_enough:
        score, passed, partial = 10, True, False
        finding = "Valid llms.txt file found with H1 heading and sufficient content."
    elif has_h1 and not is_long_enough:
        score, passed, partial = 5, False, True
        finding = "llms.txt has an H1 heading but content is too short (20 chars or fewer)."
    elif not has_h1 and is_long_enough:
        score, passed, partial = 5, False, True
        finding = "llms.txt has content but is missing an H1 heading."
    else:
        score, passed, partial = 0, False, False
        finding = "llms.txt file exists but lacks both an H1 heading and sufficient content."

    return CheckResult(
        name="llms.txt Discovery File",
        score=score, max_score=10, passed=passed, partial=partial,
        description="Checks for an llms.txt file at your domain root for developer agent context.",
        finding=finding,
        fix="Format your llms.txt starting with a '# Project Title' line followed by a paragraph of context.",
        details={"found": True, "has_h1": has_h1, "char_length": len(llms_content.strip())}
    )
