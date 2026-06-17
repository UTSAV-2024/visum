import json
from bs4 import BeautifulSoup
from ..schemas import CheckResult

VALID_TYPES = ["Product", "Organization", "LocalBusiness", "FAQPage", "BreadcrumbList", "Service", "Event", "Article"]

async def check_schema_ld(html_content: str) -> CheckResult:
    """Parses HTML for structured JSON-LD data blocks."""
    if not html_content:
        return CheckResult(
            name="JSON-LD Structured Data", score=0, max_score=20, passed=False,
            description="Parses HTML for structured data blocks to see if agents can read your catalog.",
            finding="No page content available to parse.", fix="Ensure your site permits crawler traffic."
        )

    try:
        soup = BeautifulSoup(html_content, "html.parser")
        scripts = soup.find_all("script", type="application/ld+json")
        
        if not scripts:
            return CheckResult(
                name="JSON-LD Structured Data", score=0, max_score=20, passed=False,
                description="Parses HTML for structured data blocks.",
                finding="No JSON-LD structured data blocks found on this page.",
                fix="Add JSON-LD blocks. AgentReady Pro generates valid schemas automatically.",
                details={"found_count": 0}
            )

        found_types = []
        has_required_fields = False

        for script in scripts:
            try:
                data = json.loads(script.string or "")
                # Handle both single objects and graphs/arrays
                items = data if isinstance(data, list) else data.get("@graph", [data]) if isinstance(data, dict) else [data]
                
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    schema_type = item.get("@type")
                    if schema_type:
                        found_types.append(schema_type)
                        # Validate basic required fields for standard commercial elements
                        if schema_type == "Product" and "name" in item:
                            has_required_fields = True
                        elif schema_type in ["Organization", "LocalBusiness"] and "name" in item:
                            has_required_fields = True
            except Exception:
                continue

        valid_detected = [t for t in found_types if t in VALID_TYPES]

        if valid_detected and has_required_fields:
            score, passed, partial = 20, True, False
            finding = f"Valid JSON-LD found matching types: {', '.join(valid_detected)}."
        elif valid_detected:
            score, passed, partial = 10, False, True
            finding = f"Schema markup types detected ({', '.join(valid_detected)}) but key fields (like name/price) are missing."
        else:
            score, passed, partial = 0, False, False
            finding = f"JSON-LD block found but uses unoptimized types: {', '.join(found_types) if found_types else 'None'}."

        return CheckResult(
            name="JSON-LD Structured Data", score=score, max_score=20, passed=passed, partial=partial,
            description="Parses HTML for valid structured data blocks conforming to schema.org specifications.",
            finding=finding, fix="Ensure all target structured data types contain mandatory entity fields.",
            details={"detected_types": found_types, "valid_types": valid_detected}
        )
    except Exception as e:
        return CheckResult(
            name="JSON-LD Structured Data", score=0, max_score=20, passed=False,
            description="Parses HTML for structured data blocks.", finding=f"Parsing error: {str(e)}",
            fix="Ensure your structured blocks use error-free, uncorrupted JSON strings."
        )