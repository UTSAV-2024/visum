"""
Metric Validators — One validator per displayed metric.

Each metric has a contract defining:
  - What inputs it requires
  - What validation rules it must pass
  - What happens when validation fails

Pattern: Register all contracts at module load time.
"""

import logging
from typing import Any

from .contracts import (
    MetricContract,
    MetricInventory,
    MetricSource,
    ValidationRule,
    ValidationSeverity,
)

logger = logging.getLogger(__name__)

# ── Helper validation functions ──────────────────────────────────────


def _is_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def _is_str(value: Any) -> bool:
    return isinstance(value, str)


def _is_bool(value: Any) -> bool:
    return isinstance(value, bool)


def _in_range(min_v: int, max_v: int) -> ValidationRule:
    """Factory: rule that value is int in [min_v, max_v]."""
    return ValidationRule(
        name=f"range_{min_v}_{max_v}",
        description=f"Value must be an integer between {min_v} and {max_v}",
        severity=ValidationSeverity.BLOCKING,
        validate_fn=lambda v: _is_int(v) and min_v <= v <= max_v,
        failure_message=f"Value must be an integer between {min_v} and {max_v}",
    )


def _is_non_negative(value: Any) -> bool:
    return _is_int(value) and value >= 0


def _is_valid_band(value: Any) -> bool:
    valid_bands = {"Agent-Ready", "Partially Visible", "Mostly Invisible", "Agent-Invisible"}
    return _is_str(value) and value in valid_bands


def _has_field(name: str, field_type: type | None = None) -> ValidationRule:
    """Factory: rule that value is a dict containing a field."""
    def _check(value: Any) -> bool:
        if not isinstance(value, dict):
            return False
        if name not in value:
            return False
        if field_type is not None:
            return isinstance(value[name], field_type)
        return True
    return ValidationRule(
        name=f"has_field_{name}",
        description=f"Value must contain field '{name}'",
        severity=ValidationSeverity.BLOCKING,
        validate_fn=_check,
        failure_message=f"Missing required field: '{name}'",
    )


def _is_list_of(min_len: int, max_len: int | None = None) -> ValidationRule:
    def _check(value: Any) -> bool:
        if not isinstance(value, list):
            return False
        if len(value) < min_len:
            return False
        if max_len is not None and len(value) > max_len:
            return False
        return True
    return ValidationRule(
        name=f"list_length_{min_len}_{max_len or 'inf'}",
        description=f"Value must be a list with at least {min_len} items",
        severity=ValidationSeverity.BLOCKING,
        validate_fn=_check,
        failure_message=f"Must be a list with at least {min_len} items",
    )


def _is_valid_check(value: Any) -> bool:
    """Validate a single CheckResult."""
    if not isinstance(value, dict):
        return False
    required = {"name", "score", "max_score", "passed", "finding"}
    return all(k in value for k in required)


# ── Register all metric contracts ────────────────────────────────────

def _register_contracts() -> None:
    """Register every metric contract at module load time."""

    # ── 1. Overall Score ──────────────────────────────────────────
    MetricInventory.register(MetricContract(
        name="total_score",
        display_name="Overall Score",
        description="Aggregate AI readiness score (sum of 8 check scores)",
        source=MetricSource.BACKEND_CALCULATED,
        required_inputs=["checks"],
        rules=[
            ValidationRule(
                name="score_type",
                description="Score must be an integer",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_int,
                failure_message="Score must be an integer",
            ),
            _in_range(0, 100),
        ],
        failure_behaviour="HIDE all score components, show 'Scan Failed'",
        tooltip="Overall score measuring your site's AI agent readiness. Calculated by summing 8 individual check scores.",
    ))

    # ── 2. Band ────────────────────────────────────────────────────
    MetricInventory.register(MetricContract(
        name="band",
        display_name="Readiness Band",
        description="Human-readable readiness level",
        source=MetricSource.BACKEND_CALCULATED,
        required_inputs=["total_score"],
        rules=[
            ValidationRule(
                name="valid_band",
                description="Band must be one of the valid readiness levels",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_valid_band,
                failure_message="Band must be one of: Agent-Ready, Partially Visible, Mostly Invisible, Agent-Invisible",
            ),
            ValidationRule(
                name="band_is_string",
                description="Band must be a string",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_str,
                failure_message="Band must be a string",
            ),
        ],
        failure_behaviour="HIDE band badge, use 'Unknown' fallback",
        tooltip="Your site's AI readiness classification. Based on your total score relative to system thresholds.",
    ))

    # ── 3. Scan Confidence (frontend heuristic, now validated) ─────
    MetricInventory.register(MetricContract(
        name="scan_confidence",
        display_name="Scan Confidence",
        description="Confidence that the scan produced reliable results",
        source=MetricSource.BACKEND_DERIVED,
        required_inputs=["checks", "crawler_status"],
        rules=[
            _in_range(0, 100),
            ValidationRule(
                name="confidence_is_int",
                description="Confidence must be an integer",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_int,
                failure_message="Confidence must be an integer",
            ),
        ],
        failure_behaviour="HIDE scan confidence component",
        tooltip="Confidence is calculated from successful retrievals (robots.txt, sitemap, rendered HTML, performance metrics).",
    ))

    # ── 4. Dimension Scores (Radar) ─────────────────────────────────
    MetricInventory.register(MetricContract(
        name="dimension_scores",
        display_name="Radar Dimension Scores",
        description="Per-dimension AI readiness scores (5 dimensions)",
        source=MetricSource.BACKEND_DERIVED,
        required_inputs=["checks"],
        rules=[
            _is_list_of(5, 5),
        ],
        failure_behaviour="HIDE radar chart component",
        tooltip="Breakdown across 5 dimensions: Discovery, Accessibility, Structure, Citation Readiness, Agent Interaction.",
    ))

    # ── 5. Projected Score ─────────────────────────────────────────
    MetricInventory.register(MetricContract(
        name="projected_score",
        display_name="Projected Score",
        description="Maximum achievable score if all issues are fixed",
        source=MetricSource.BACKEND_DERIVED,
        required_inputs=["total_score", "recoverable_points"],
        rules=[
            _in_range(0, 100),
            ValidationRule(
                name="projected_is_int",
                description="Projected score must be an integer",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_int,
                failure_message="Projected score must be an integer",
            ),
        ],
        failure_behaviour="HIDE projected score, show only current score",
        tooltip="Projected score if all identified issues are fully resolved. Actual results depend on implementation quality.",
    ))

    # ── 6. Recoverable Points ──────────────────────────────────────
    MetricInventory.register(MetricContract(
        name="recoverable_points",
        display_name="Recoverable Points",
        description="Points that can be gained by fixing all issues",
        source=MetricSource.BACKEND_DERIVED,
        required_inputs=["checks"],
        rules=[
            ValidationRule(
                name="recoverable_non_negative",
                description="Recoverable points must be non-negative",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_non_negative,
                failure_message="Recoverable points must be a non-negative integer",
            ),
            _in_range(0, 100),
        ],
        failure_behaviour="HIDE recoverable points display",
        tooltip="Total points available from fixing all failing checks.",
    ))

    # ── 7. Compatibility Score (per agent) ─────────────────────────
    for agent_id in ["chatgpt", "claude", "perplexity", "cursor", "gemini"]:
        MetricInventory.register(MetricContract(
            name=f"compatibility_{agent_id}",
            display_name=f"{agent_id.title()} Compatibility",
            description=f"Compatibility score for {agent_id}",
            source=MetricSource.BACKEND_DERIVED,
            required_inputs=["checks", "agent_weights"],
            rules=[
                _in_range(0, 100),
                ValidationRule(
                    name="compat_is_int",
                    description="Compatibility must be an integer",
                    severity=ValidationSeverity.BLOCKING,
                    validate_fn=_is_int,
                    failure_message="Compatibility must be an integer",
                ),
            ],
            failure_behaviour="HIDE individual agent card",
            tooltip=f"Compatibility with {agent_id}. Based on which checks pass and their importance to this agent.",
        ))

    # ── 8. Individual Check Score ───────────────────────────────────
    check_names = [
        "AI Bot Permissions (robots.txt)",
        "JSON-LD Structured Data",
        "llms.txt File",
        "MCP Endpoint",
        "JavaScript Rendering",
        "Meta Tags and Open Graph",
        "Sitemap.xml",
        "Page Load Speed",
    ]
    for check_name in check_names:
        sanitized = check_name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')
        MetricInventory.register(MetricContract(
            name=f"check_{sanitized}",
            display_name=check_name,
            description=f"Check result for {check_name}",
            source=MetricSource.BACKEND_MEASURED,
            required_inputs=["crawl_data"],
            rules=[
                ValidationRule(
                    name="valid_check_structure",
                    description="Check must have required fields (name, score, max_score, passed, finding)",
                    severity=ValidationSeverity.BLOCKING,
                    validate_fn=_is_valid_check,
                    failure_message="Check is missing required fields",
                ),
            ],
            failure_behaviour="HIDE individual check card, show 'Check Failed' notice",
            tooltip=f"Measures whether {check_name} meets AI visibility standards.",
        ))

    # ── 9. Journey Stage Scores (4 stages) ──────────────────────────
    for stage_id in ["discovery", "understanding", "citation", "interaction"]:
        MetricInventory.register(MetricContract(
            name=f"journey_{stage_id}",
            display_name=f"Journey: {stage_id.title()}",
            description=f"AI visibility journey stage score for {stage_id}",
            source=MetricSource.BACKEND_DERIVED,
            required_inputs=["checks"],
            rules=[
                _in_range(0, 100),
                ValidationRule(
                    name="journey_is_int",
                    description="Journey score must be an integer",
                    severity=ValidationSeverity.BLOCKING,
                    validate_fn=_is_int,
                    failure_message="Journey score must be an integer",
                ),
            ],
            failure_behaviour="HIDE journey stage indicator",
            tooltip=f"Progress in the {stage_id} stage of AI visibility.",
        ))

    # ── 10. Priority / Quick Win ───────────────────────────────────
    MetricInventory.register(MetricContract(
        name="priority_fixes",
        display_name="Priority Fixes",
        description="Prioritized list of fixes sorted by impact",
        source=MetricSource.BACKEND_DERIVED,
        required_inputs=["checks"],
        rules=[
            ValidationRule(
                name="priority_is_list",
                description="Priority fixes must be a list",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=lambda v: isinstance(v, list),
                failure_message="Priority fixes must be a list",
            ),
        ],
        failure_behaviour="HIDE priority roadmap, show 'No issues found'",
        tooltip="Fixes sorted by highest impact and lowest effort first.",
    ))

    # ── 11. Upgrade CTA ────────────────────────────────────────────
    MetricInventory.register(MetricContract(
        name="upgrade_cta",
        display_name="Upgrade CTA",
        description="Personalized upgrade prompt",
        source=MetricSource.BACKEND_DERIVED,
        required_inputs=["score", "checks"],
        rules=[
            ValidationRule(
                name="cta_is_string",
                description="CTA must be a string",
                severity=ValidationSeverity.WARNING,
                validate_fn=_is_str,
                failure_message="CTA must be a string",
            ),
        ],
        failure_behaviour="Show default upgrade prompt",
        tooltip="Personalized recommendation for Visum Pro based on your scan results.",
    ))

    # ── 12. Scan Time ─────────────────────────────────────────────
    MetricInventory.register(MetricContract(
        name="scan_time_ms",
        display_name="Scan Duration",
        description="Total scan execution time in milliseconds",
        source=MetricSource.BACKEND_MEASURED,
        required_inputs=["t0_timestamp"],
        rules=[
            ValidationRule(
                name="scan_time_non_negative",
                description="Scan time must be non-negative",
                severity=ValidationSeverity.BLOCKING,
                validate_fn=_is_non_negative,
                failure_message="Scan time must be a non-negative integer",
            ),
        ],
        failure_behaviour="HIDE scan time, show 'N/A'",
        tooltip="Total time taken to complete the scan.",
    ))

    logger.info(f"Registered {len(MetricInventory._contracts)} metric contracts")


class MetricValidator:
    """
    Validates scan results against all metric contracts.
    Returns per-metric validation results with render decisions.
    """

    @staticmethod
    def validate_scan_result(total_score: int, band: str, checks: list, **kwargs) -> dict[str, dict]:
        """Validate a complete scan result against all contracts."""
        values = {
            "total_score": total_score,
            "band": band,
            **kwargs,
        }
        results = MetricInventory.validate_all(values, {"checks": checks})
        return {
            name: r.to_dict() for name, r in results.items()
        }

    @staticmethod
    def can_render_metric(metric_name: str, validation: dict | None) -> bool:
        """Check if a specific metric can be rendered."""
        if validation is None:
            return False
        return validation.get("can_render", False)

    @staticmethod
    def filter_renderable(validations: dict[str, dict]) -> dict[str, dict]:
        """Filter validations to only those that can render."""
        return {
            name: v for name, v in validations.items()
            if v.get("can_render", False)
        }


# Register contracts at module load
_register_contracts()
