"""
Integration layer — wires verification into the scan result pipeline.
Adds verification metadata (validation status, evidence status) to the API response.

Scan
  → Checks (measured)
  → Scoring (calculated)
  → Validation (verification)
  → API Response (verified)
"""

import logging
from typing import Any

from .contracts import ValidationResult
from .validators import MetricValidator
from .evidence import EvidenceValidator

logger = logging.getLogger(__name__)


def validate_scan_results(
    total_score: int,
    band: str,
    checks: list[dict],
    **extra: Any,
) -> dict[str, Any]:
    """
    Run the full verification pipeline on scan results.

    Returns a verification envelope containing:
      - metric_validations: per-metric validation results
      - evidence_validations: per-check evidence results
      - can_render: overall render decision
      - renderable_checks: checks that passed evidence validation
    """
    # 1. Validate all metrics
    metric_validations = MetricValidator.validate_scan_result(
        total_score=total_score,
        band=band,
        checks=checks,
        **extra,
    )

    # 2. Validate evidence for all recommendations
    check_dicts = []
    for c in checks:
        if hasattr(c, "model_dump"):
            check_dicts.append(c.model_dump())
        elif isinstance(c, dict):
            check_dicts.append(c)
        else:
            check_dicts.append({
                "name": getattr(c, "name", "unknown"),
                "score": getattr(c, "score", 0),
                "max_score": getattr(c, "max_score", 0),
                "passed": getattr(c, "passed", True),
                "partial": getattr(c, "partial", False),
                "finding": getattr(c, "finding", ""),
                "fix": getattr(c, "fix", ""),
            })

    evidence_validations = EvidenceValidator.validate_all_checks(check_dicts)
    renderable_checks = EvidenceValidator.get_renderable_recommendations(check_dicts)

    # 3. Determine overall renderability
    blocking_failures = [
        name for name, v in metric_validations.items()
        if not v.get("can_render", True)
    ]
    can_render_overall = len(blocking_failures) == 0

    # 4. Remove non-renderable checks from renderable list
    cleaned_renderable = []
    for check in renderable_checks:
        name = check.get("name", "unknown")
        evidence = evidence_validations.get(name, {})
        if evidence.get("has_evidence", True) or check.get("passed", False):
            cleaned_renderable.append(check)

    return {
        "verification": {
            "version": "1.0.0",
            "can_render_overall": can_render_overall,
            "blocking_failures": blocking_failures,
            "metric_validations": {
                name: {
                    "status": v.get("status", "unknown"),
                    "can_render": v.get("can_render", False),
                    "errors": v.get("errors", []),
                }
                for name, v in metric_validations.items()
            },
            "evidence_validations": evidence_validations,
            "renderable_check_count": len(cleaned_renderable),
            "total_check_count": len(checks),
        },
        "renderable_checks": cleaned_renderable,
    }
