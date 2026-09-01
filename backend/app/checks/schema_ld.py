# backend/app/checks/schema_ld.py
import json
import re
from bs4 import BeautifulSoup
from ..schemas import CheckResult
 
# Required fields per schema type
SCHEMA_REQUIREMENTS = {
    "Product":       ["name", "offers"],
    "Organization":  ["name", "url"],
    "LocalBusiness": ["name", "address", "telephone"],
    "FAQPage":       ["mainEntity"],
    "BreadcrumbList":["itemListElement"],
    "Service":       ["name", "provider"],
    "Article":       ["headline", "author"],
    "WebSite":       ["name", "url"],
    "Event":         ["name", "startDate"],
    "Person":        ["name"],
}
 
HIGH_VALUE_TYPES = ["Product", "LocalBusiness", "FAQPage", "Service"]
 
 
def extract_json_ld(html: str) -> list:
    """Extract all JSON-LD blocks from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    scripts = soup.find_all("script", type="application/ld+json")
    schemas = []
    for script in scripts:
        try:
            data = json.loads(script.string or "")
            # Handle @graph arrays
            if "@graph" in data:
                schemas.extend(data["@graph"])
            elif isinstance(data, list):
                schemas.extend(data)
            else:
                schemas.append(data)
        except (json.JSONDecodeError, TypeError):
            continue
    return schemas
 
 
def validate_schema(schema: dict) -> tuple:
    """
    Validate a single schema object.
    Returns: (schema_type, missing_fields, is_high_value)
    """
    schema_type = schema.get("@type", "Unknown")
    # Handle array types like ["Organization", "LocalBusiness"]
    if isinstance(schema_type, list):
        schema_type = schema_type[0]
 
    required = SCHEMA_REQUIREMENTS.get(schema_type, [])
    missing = [f for f in required if f not in schema or not schema[f]]
    is_high_value = schema_type in HIGH_VALUE_TYPES
 
    return schema_type, missing, is_high_value
 
 
async def check_schema_ld(html: str) -> CheckResult:
    """Check for valid JSON-LD structured data in page HTML."""
    if not html:
        return CheckResult(
            name="JSON-LD Structured Data",
            score=0, max_score=20, passed=False,
            description="Checks for valid JSON-LD structured data that helps AI agents understand your site.",
            finding="No HTML content to analyse.",
            fix="Ensure your page is publicly accessible and returns HTML content.",
            details={}
        )
 
    schemas = extract_json_ld(html)
 
    if not schemas:
        return CheckResult(
            name="JSON-LD Structured Data",
            score=0, max_score=20, passed=False,
            description="Checks for JSON-LD structured data that helps AI agents understand your content.",
            finding="No JSON-LD structured data found. AI agents must guess what your site is about.",
            fix="Add JSON-LD schema markup to your page. Start with Organization schema for your homepage and Product schema for product pages.",
            details={"schemas_found": 0}
        )
 
    # Validate all schemas found
    validations = [validate_schema(s) for s in schemas]
    high_value = [(t, m, hv) for t, m, hv in validations if hv]
    complete = [(t, m, hv) for t, m, hv in validations if len(m) == 0]
    all_types = [t for t, _, _ in validations]
 
    # Scoring logic
    if high_value and all(len(m) == 0 for _, m, _ in high_value):
        # High-value schema type present and complete
        score, passed, partial = 20, True, False
        best_type = high_value[0][0]
        finding = f"Valid {best_type} schema found with all required fields. Excellent."
    elif complete:
        # Some complete schemas but not high-value types
        score, passed, partial = 15, False, True
        best_type = complete[0][0]
        finding = f"Valid {best_type} schema found. Consider adding Product or LocalBusiness schema for higher agent visibility."
    elif schemas:
        # Schemas present but incomplete
        all_missing = []
        for t, m, _ in validations:
            if m:
                all_missing.append(f"{t} missing: {', '.join(m)}")
        score, passed, partial = 10, False, True
        finding = f"JSON-LD found but incomplete. Issues: {'; '.join(all_missing[:2])}"
    else:
        score, passed, partial = 0, False, False
        finding = "No valid JSON-LD found."
 
    return CheckResult(
        name="JSON-LD Structured Data",
        score=score, max_score=20,
        passed=passed, partial=partial,
        description="Checks for valid JSON-LD structured data. Schema markup gives AI systems explicit, machine-readable facts about your content instead of forcing them to infer meaning from raw HTML.",
        finding=finding,
        fix="Add or complete your JSON-LD schema so AI systems can parse your content instead of guessing.",
        details={"schemas_found": len(schemas), "types": all_types,
                 "high_value_types": [t for t, _, hv in validations if hv],
                 "complete_schemas": [t for t, m, _ in validations if len(m) == 0]}
    )
