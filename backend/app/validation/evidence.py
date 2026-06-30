"""
Evidence Validation — Every recommendation must have supporting evidence.

No recommendation can be displayed without evidence.
No evidence means the recommendation is hidden.

Pattern: A recommendation is only valid if:
  1. The check it references was actually executed
  2. The check produced a finding (passed=False or partial=True)
  3. The check has a fix that addresses the finding
  4. The finding contains specific evidence (not generic text)
"""

import logging
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)

# Generic findings that indicate no real evidence was collected
_GENERIC_FINDINGS = [
    "could not fetch",
    "no html content",
    "could not measure",
    "assuming",
    "error:",
    "no content was extracted",
]

# Generic fixes that indicate no specific guidance is available
_GENERIC_FIXES = [
    "ensure your page",
    "verify crawler",
    "review",
    "generic",
]


@dataclass
class EvidenceCheckResult:
    """Result of an evidence check for a recommendation."""
    has_evidence: bool
    evidence_items: list[str] = field(default_factory=list)
    reason: str = ""

    def to_dict(self) -> dict:
        return {
            "has_evidence": self.has_evidence,
            "evidence_items": self.evidence_items,
            "reason": self.reason,
        }


def _has_real_evidence(finding: str) -> bool:
    """Check if a finding contains actual evidence vs generic text."""
    if not finding:
        return False
    finding_lower = finding.lower()
    for generic in _GENERIC_FINDINGS:
        if generic in finding_lower:
            return False
    # Must contain at least some specifics
    has_numbers = any(c.isdigit() for c in finding)
    has_specific_phrases = any(
        phrase in finding_lower
        for phrase in ["found", "detected", "blocked", "allowed", "missing", "present", "valid", "invalid"]
    )
    return has_numbers or has_specific_phrases


def _has_specific_fix(fix: str) -> bool:
    """Check if a fix provides specific guidance vs generic advice."""
    if not fix:
        return False
    fix_lower = fix.lower()
    for generic in _GENERIC_FIXES:
        if generic in fix_lower:
            return False
    return True


class EvidenceValidator:
    """
    Validates that every recommendation has supporting evidence.
    A recommendation without evidence must not be displayed.
    """

    @staticmethod
    def validate_check_recommendation(check: dict) -> EvidenceCheckResult:
        """
        Validate that a single check's recommendation has evidence.

        A valid recommendation requires:
          1. The check actually failed or partially failed
          2. There is a specific finding (not generic)
          3. There is a specific fix (not generic)
          4. The finding contains evidence (numbers, specific details)
        """
        passed = check.get("passed", True)
        partial = check.get("partial", False)
        finding = check.get("finding", "")
        fix = check.get("fix", "")
        name = check.get("name", "Unknown check")
        score = check.get("score", 0)
        max_score = check.get("max_score", 0)

        # If the check passed, no recommendation needed
        if passed and not partial:
            return EvidenceCheckResult(
                has_evidence=False,
                evidence_items=[],
                reason=f"Check '{name}' passed — no recommendation needed",
            )

        evidence_items = []

        # Evidence 1: Score shows actual points lost
        points_lost = max_score - score
        if points_lost > 0:
            evidence_items.append(f"Lost {points_lost}/{max_score} points (score: {score}/{max_score})")

        # Evidence 2: Finding contains real data
        if finding and _has_real_evidence(finding):
            evidence_items.append(f"Finding: {finding[:120]}")
        else:
            return EvidenceCheckResult(
                has_evidence=False,
                evidence_items=evidence_items,
                reason=f"Check '{name}' has no specific evidence in finding",
            )

        # Evidence 3: Fix is specific
        if fix and _has_specific_fix(fix):
            evidence_items.append(f"Fix available: {fix[:120]}")
        else:
            return EvidenceCheckResult(
                has_evidence=False,
                evidence_items=evidence_items,
                reason=f"Check '{name}' fix is too generic to display",
            )

        return EvidenceCheckResult(
            has_evidence=True,
            evidence_items=evidence_items,
            reason="All evidence checks passed",
        )

    @staticmethod
    def validate_all_checks(checks: list[dict]) -> dict[str, dict]:
        """Validate evidence for all checks."""
        results = {}
        for check in checks:
            result = EvidenceValidator.validate_check_recommendation(check)
            results[check.get("name", "unknown")] = result.to_dict()
        return results

    @staticmethod
    def get_renderable_recommendations(checks: list[dict]) -> list[dict]:
        """Return only the checks that have valid evidence for their recommendations."""
        renderable = []
        for check in checks:
            result = EvidenceValidator.validate_check_recommendation(check)
            if result.has_evidence or (check.get("passed", False) and not check.get("partial", False)):
                # Passed checks are always renderable (no recommendation needed)
                # Failed/partial checks need evidence
                if not check.get("passed", True):
                    # Only include if evidence exists
                    if result.has_evidence:
                        renderable.append(check)
                else:
                    renderable.append(check)
        return renderable
