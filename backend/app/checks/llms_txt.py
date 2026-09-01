# backend/app/checks/llms_txt.py
import re
from ..schemas import CheckResult
 
REQUIRED_FIELDS = ["project_name", "description", "urls"]
 
 
def parse_llms_txt(content: str) -> dict:
    """
    Parse llms.txt content and extract key fields.
    Returns dict with: project_name, description, url_count, sections
    """
    result = {
        "project_name": None,
        "description": "",
        "url_count": 0,
        "sections": [],
        "has_optional": False,
    }
 
    if not content or not content.strip():
        return result
 
    lines = content.strip().splitlines()
 
    # First non-empty line starting with > is the project name
    for line in lines:
        stripped = line.strip()
        if stripped.startswith(">"):
            result["project_name"] = stripped[1:].strip()
            break
        elif stripped and not stripped.startswith("#"):
            # Some sites use first plain line as title
            result["project_name"] = stripped
            break
 
    # Count markdown links (URLs)
    url_pattern = re.compile(r'\[.*?\]\((https?://.*?)\)')
    result["url_count"] = len(url_pattern.findall(content))
 
    # Find section headers
    section_pattern = re.compile(r'^##\s+(.+)', re.MULTILINE)
    result["sections"] = section_pattern.findall(content)
 
    # Check for Optional section
    result["has_optional"] = "Optional" in result["sections"]
 
    # Extract description (lines between title and first ## section)
    in_desc = False
    desc_lines = []
    for line in lines:
        if line.startswith(">") or (result["project_name"] and line.strip() == result["project_name"]):
            in_desc = True
            continue
        if in_desc:
            if line.startswith("##"):
                break
            if line.strip():
                desc_lines.append(line.strip())
    result["description"] = " ".join(desc_lines)
 
    return result
 
 
async def check_llms_txt(llms_content: str = "") -> CheckResult:
    """Check for valid llms.txt file."""

    # Treat whitespace-only bodies as absent — a soft-404 or blank file is not
    # a "present but incomplete" llms.txt.
    if not llms_content or not llms_content.strip():
        return CheckResult(
            name="llms.txt File",
            score=0, max_score=10, passed=False,
            description="Checks for llms.txt, a file that helps AI coding assistants understand your project.",
            finding="No llms.txt file found at /llms.txt.",
            fix="Create an llms.txt file at your domain root. Most valuable for developer tools and API documentation sites. Less impactful for e-commerce.",
            details={"found": False}
        )
 
    parsed = parse_llms_txt(llms_content)
    issues = []
 
    if not parsed["project_name"]:
        issues.append("missing project name (add line starting with >)")
    if not parsed["description"]:
        issues.append("missing description")
    if parsed["url_count"] == 0:
        issues.append("no documentation URLs found")
 
    if not issues:
        score, passed, partial = 10, True, False
        finding = f"Valid llms.txt found. Project: {parsed['project_name']}. {parsed['url_count']} documentation URL(s) listed."
    elif len(issues) == 1:
        score, passed, partial = 5, False, True
        finding = f"llms.txt found but incomplete: {issues[0]}."
    else:
        score, passed, partial = 5, False, True
        finding = f"llms.txt found but has {len(issues)} issues: {'; '.join(issues)}."
 
    return CheckResult(
        name="llms.txt File",
        score=score, max_score=10,
        passed=passed, partial=partial,
        description="Checks for llms.txt which helps AI coding assistants understand your project. Most valuable for developer tools and API documentation sites.",
        finding=finding,
        fix="Ensure your llms.txt has a project name (line starting with >), a description, and at least one ## section with documentation links.",
        details={"found": True, "project_name": parsed["project_name"],
                 "url_count": parsed["url_count"], "sections": parsed["sections"],
                 "issues": issues}
    )
