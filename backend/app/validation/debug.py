"""
Developer Debug Mode — Shows raw data, validation status, evidence, and formulas.

Only accessible in development. Activated by:
  1. Query parameter: ?debug=true on any API endpoint
  2. Frontend: ?debug=true on the report page

Provides visibility into:
  - Raw API response
  - Per-metric validation status
  - Evidence checks for each recommendation
  - Calculation steps and formulas
  - Rendering decisions
"""

import os
import logging
from typing import Any

from .contracts import MetricInventory
from .validators import MetricValidator
from .evidence import EvidenceValidator

logger = logging.getLogger(__name__)

# Check if we're in debug mode
_IS_DEBUG = os.getenv("VISUM_DEBUG", "false").lower() == "true"


def is_debug_mode() -> bool:
    """Check if debug mode is enabled via environment or query param."""
    return _IS_DEBUG


def build_debug_panel(
    total_score: int,
    band: str,
    checks: list[dict],
    scan_time_ms: int = 0,
    **extra: Any,
) -> dict:
    """
    Build a comprehensive debug panel for the scan result.

    Shows:
      - Raw inputs: what data was received
      - Metric validations: per-metric status with errors
      - Evidence checks: which recommendations have evidence
      - Formulas: how each metric was calculated
      - Rendering decisions: what will/won't be shown
    """
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

    # 1. Metric validations
    metric_validations = MetricValidator.validate_scan_result(
        total_score=total_score,
        band=band,
        checks=check_dicts,
        **extra,
    )

    # 2. Evidence checks
    evidence = EvidenceValidator.validate_all_checks(check_dicts)

    # 3. Rendering decisions
    renderable = EvidenceValidator.get_renderable_recommendations(check_dicts)

    return {
        "summary": {
            "total_score": total_score,
            "band": band,
            "checks_count": len(check_dicts),
            "passed_checks": sum(1 for c in check_dicts if c.get("passed")),
            "failed_checks": sum(1 for c in check_dicts if not c.get("passed") and not c.get("partial")),
            "partial_checks": sum(1 for c in check_dicts if c.get("partial")),
        },
        "formulas": {
            "total_score": "sum of all 8 check.scores (range: 0-100)",
            "band": "threshold: >=85=Agent-Ready, >=65=Partially Visible, >=40=Mostly Invisible, <40=Agent-Invisible",
            "scan_confidence": "base=50 + robots_found(+12) + sitemap_found(+12) + speed_measured(+10) + rendered_content(+8) + static_content(+8) + meta_present(+5) + schema_found(+5), max=100",
            "projected_score": "min(total_score + sum(max_score - score for failed checks), 100)",
            "dimension_scores": "weighted sum of check scores mapped to 5 dimensions",
        },
        "validations": {
            name: {
                "status": v.get("status", "unknown"),
                "can_render": v.get("can_render", False),
                "errors": v.get("errors", []),
                "warnings": v.get("warnings", []),
            }
            for name, v in metric_validations.items()
        },
        "evidence": {
            name: {
                "has_evidence": ev.get("has_evidence", False),
                "items": ev.get("evidence_items", []),
                "reason": ev.get("reason", ""),
            }
            for name, ev in evidence.items()
        },
        "rendering_decisions": {
            "renderable_recommendations": [
                {"name": c.get("name"), "score": f"{c.get('score')}/{c.get('max_score')}", "has_finding": bool(c.get("finding"))}
                for c in renderable
            ],
            "hidden_recommendations": [
                {"name": c.get("name"), "reason": evidence.get(c.get("name", ""), {}).get("reason", "No evidence")}
                for c in check_dicts
                if not c.get("passed") and c.get("name") not in {r.get("name") for r in renderable}
            ],
            "total_contracts": len(MetricInventory._contracts),
        },
    }


def query_param_check(params: dict) -> bool:
    """Check if debug mode is requested via query parameters."""
    return params.get("debug", "").lower() == "true"
