import json
from bs4 import BeautifulSoup
from ..schemas import CheckResult

async def check_schema_ld(html_content: str) -> CheckResult:
    """Parses HTML for <script type=\"application/ld+json\"> blocks using BeautifulSoup."""
    if not html_content:
        return CheckResult(
            name="JSON-LD Structured Data",
            score=0, max_score=20, passed=False,
            description="Parses HTML for JSON-LD structured data blocks that AI agents use to understand your content.",
            finding="No HTML content provided to parse.",
            fix="Ensure your site returns HTML content with structured data.",
            details={"found_count": 0}
        )

    try:
        soup = BeautifulSoup(html_content, "html.parser")
        scripts = soup.find_all("script", type="application/ld+json")

        if not scripts:
            return CheckResult(
                name="JSON-LD Structured Data",
                score=0, max_score=20, passed=False,
                description="Parses HTML for JSON-LD structured data blocks that AI agents use to understand your content.",
                finding="No JSON-LD structured data blocks found on this page.",
                fix="Add JSON-LD structured data using <script type=\"application/ld+json\"> tags to your HTML.",
                details={"found_count": 0}
            )

        valid_count = 0
        parsed_types = []

        for script in scripts:
            raw = script.string
            if not raw:
                continue
            try:
                data = json.loads(raw.strip())
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if isinstance(item, dict) and "@type" in item:
                        parsed_types.append(item["@type"])
                        valid_count += 1
            except (json.JSONDecodeError, ValueError):
                continue

        if valid_count > 0:
            return CheckResult(
                name="JSON-LD Structured Data",
                score=20, max_score=20, passed=True,
                description="Parses HTML for JSON-LD structured data blocks that AI agents use to understand your content.",
                finding=f"Found {valid_count} valid JSON-LD block(s) with types: {', '.join(parsed_types)}.",
                fix="Keep your structured data updated and compliant with schema.org standards.",
                details={"found_count": len(scripts), "valid_count": valid_count, "types": parsed_types}
            )
        else:
            return CheckResult(
                name="JSON-LD Structured Data",
                score=10, max_score=20, passed=False, partial=True,
                description="Parses HTML for JSON-LD structured data blocks that AI agents use to understand your content.",
                finding=f"Found {len(scripts)} JSON-LD script tag(s), but none contained valid parsable JSON.",
                fix="Ensure each JSON-LD script tag contains valid, well-formed JSON.",
                details={"found_count": len(scripts), "valid_count": 0}
            )

    except Exception as e:
        return CheckResult(
            name="JSON-LD Structured Data",
            score=0, max_score=20, passed=False,
            description="Parses HTML for JSON-LD structured data blocks that AI agents use to understand your content.",
            finding=f"Error parsing HTML: {str(e)}",
            fix="Ensure your HTML is well-formed and accessible.",
            details={"error": str(e)}
        )
