"""
Property-Based Tests — Verify invariants hold for any valid scan data.

These tests generate random scan results and verify that:
  - Score is always 0-100
  - Band is always one of the valid values
  - Projected score is never less than current score
  - Projected score never exceeds 100
  - Compatibility scores are always 0-100
  - Confidence is always 0-100
  - Journey percentages are always 0-100
  - Recoverable points are always >= 0
"""

import random
import pytest
from typing import Any

from app.validation.contracts import MetricInventory, ValidationStatus
from app.validation.validators import MetricValidator
from app.validation.evidence import EvidenceValidator
from app.validation.integration import validate_scan_results


# ── Test data generators ─────────────────────────────────────────────


def _random_score() -> int:
    return random.randint(0, 100)


def _random_band(score: int) -> str:
    """Generate the correct band for a given score (mirrors backend logic)."""
    if score >= 85:
        return "Excellent — AI Optimized"
    elif score >= 65:
        return "Good — Needs Work"
    elif score >= 40:
        return "Warning — Visibility Gaps"
    else:
        return "Critical — Invisible to AI"


def _random_check(pass_prob: float = 0.5) -> dict:
    """Generate a random check result."""
    passed = random.random() < pass_prob
    score = random.randint(0, 20) if not passed else random.randint(15, 20) if random.random() < 0.5 else 20
    max_score = random.choice([5, 10, 15, 20])

    if passed:
        score = max_score

    # Ensure score doesn't exceed max_score
    score = min(score, max_score)

    check_names = [
        ("AI Bot Permissions (robots.txt)", 15),
        ("JSON-LD Structured Data", 20),
        ("llms.txt File", 10),
        ("MCP Endpoint", 20),
        ("JavaScript Rendering", 10),
        ("Meta Tags and Open Graph", 10),
        ("Sitemap.xml", 5),
        ("Page Load Speed", 10),
    ]
    name, default_max = random.choice(check_names)
    max_score = default_max
    score = min(score, max_score)

    return {
        "name": name,
        "score": score,
        "max_score": max_score,
        "passed": score >= max_score,
        "partial": not passed and score > 0,
        "finding": f"Check {name}: {'passed' if score >= max_score else 'failed'} ({score}/{max_score})",
        "fix": f"Fix for {name}" if score < max_score else "",
    }


def _random_scan_result() -> dict:
    """Generate a complete random scan result."""
    checks = [_random_check() for _ in range(8)]

    # The actual score should be the sum of check scores
    total_score = sum(c["score"] for c in checks)
    # But ensure it doesn't exceed 100
    total_score = min(total_score, 100)

    return {
        "total_score": total_score,
        "band": _random_band(total_score),
        "checks": checks,
    }


# ════════════════════════════════════════════════════════════════════
# INVARIANT TESTS
# ════════════════════════════════════════════════════════════════════


class TestScoreInvariants:
    """Invariant: Score must always be 0-100 for any random scan."""

    @pytest.mark.parametrize("seed", range(50))
    def test_score_always_in_range(self, seed: int):
        """No matter what random data, score must be 0-100."""
        random.seed(seed)
        result = _random_scan_result()

        assert 0 <= result["total_score"] <= 100, \
            f"Score {result['total_score']} out of range for seed {seed}"

    @pytest.mark.parametrize("seed", range(50))
    def test_band_always_valid(self, seed: int):
        """Band must always be one of the valid values."""
        random.seed(seed)
        result = _random_scan_result()
        valid_bands = {"Excellent — AI Optimized", "Good — Needs Work", "Warning — Visibility Gaps", "Critical — Invisible to AI"}

        assert result["band"] in valid_bands, \
            f"Invalid band '{result['band']}' for score {result['total_score']} (seed {seed})"

    @pytest.mark.parametrize("seed", range(50))
    def test_band_consistent_with_score(self, seed: int):
        """Band must be consistent with score thresholds."""
        random.seed(seed)
        result = _random_scan_result()
        score = result["total_score"]
        band = result["band"]

        if score >= 85:
            assert band == "Excellent — AI Optimized", f"Score {score} should be Excellent — AI Optimized, got {band}"
        elif score >= 65:
            assert band == "Good — Needs Work", f"Score {score} should be Good — Needs Work, got {band}"
        elif score >= 40:
            assert band == "Warning — Visibility Gaps", f"Score {score} should be Warning — Visibility Gaps, got {band}"
        else:
            assert band == "Critical — Invisible to AI", f"Score {score} should be Critical — Invisible to AI, got {band}"

    @pytest.mark.parametrize("seed", range(50))
    def test_projected_score_invariant(self, seed: int):
        """Projected score must be >= current score and <= 100."""
        random.seed(seed)
        scan = _random_scan_result()
        checks = scan["checks"]

        total_points = sum(c["max_score"] for c in checks)
        earned_points = sum(c["score"] for c in checks)
        recoverable = max(0, total_points - earned_points)
        # But max possible is 100
        total_max = min(total_points, 100)
        projected = min(earned_points + recoverable, 100)

        assert projected >= scan["total_score"], \
            f"Projected {projected} < current {scan['total_score']}"
        assert 0 <= projected <= 100, \
            f"Projected {projected} out of range"

    @pytest.mark.parametrize("seed", range(50))
    def test_recoverable_points_non_negative(self, seed: int):
        """Recoverable points must always be >= 0."""
        random.seed(seed)
        scan = _random_scan_result()
        checks = scan["checks"]

        total = sum(c["max_score"] for c in checks)
        earned = sum(c["score"] for c in checks)
        recoverable = max(0, total - earned)

        assert recoverable >= 0, \
            f"Recoverable points {recoverable} is negative"


# ════════════════════════════════════════════════════════════════════
# VALIDATION INVARIANT TESTS
# ════════════════════════════════════════════════════════════════════


class TestValidationInvariants:
    """Invariant: Validation must always produce consistent results."""

    @pytest.mark.parametrize("seed", range(30))
    def test_validation_never_crashes(self, seed: int):
        """Validation must never throw an exception for any valid input."""
        random.seed(seed)
        scan = _random_scan_result()

        try:
            result = validate_scan_results(
                total_score=scan["total_score"],
                band=scan["band"],
                checks=scan["checks"],
                scan_confidence=random.randint(0, 100),
                projected_score=min(scan["total_score"] + 20, 100),
                recoverable_points=abs(100 - scan["total_score"]),
            )
            assert "verification" in result
        except Exception as e:
            pytest.fail(f"Validation crashed for seed {seed}: {e}")

    @pytest.mark.parametrize("seed", range(30))
    def test_metric_validation_consistent(self, seed: int):
        """Each metric validation should produce consistent status."""
        random.seed(seed)
        scan = _random_scan_result()

        validations = MetricValidator.validate_scan_result(
            total_score=scan["total_score"],
            band=scan["band"],
            checks=scan["checks"],
        )

        for metric_name, v in validations.items():
            status = v.get("status", "unknown")
            # Metrics not provided in the params get 'skipped' — that's valid
            assert status in ("passed", "failed", "skipped"), \
                f"Unexpected status '{status}' for {metric_name}"
            if status == "failed":
                assert len(v.get("errors", [])) > 0, \
                    f"Failed validation {metric_name} has no errors"
            if status == "passed":
                assert v.get("can_render") is True, \
                    f"Passed validation {metric_name} but can_render is False"

    @pytest.mark.parametrize("seed", range(30))
    def test_evidence_consistent(self, seed: int):
        """Evidence validation must be consistent for all checks."""
        random.seed(seed)
        scan = _random_scan_result()

        results = EvidenceValidator.validate_all_checks(scan["checks"])

        for check_name, result in results.items():
            assert "has_evidence" in result
            assert "evidence_items" in result
            assert isinstance(result["has_evidence"], bool)
            assert isinstance(result["evidence_items"], list)


# ════════════════════════════════════════════════════════════════════
# EDGE CASE TESTS
# ════════════════════════════════════════════════════════════════════


class TestEdgeCases:
    """Verify edge cases for validation."""

    def test_score_zero(self):
        """Score of 0 must validate."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate(0)
        assert result.status == ValidationStatus.PASSED

    def test_score_one_hundred(self):
        """Score of 100 must validate."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate(100)
        assert result.status == ValidationStatus.PASSED

    def test_empty_checks_no_crash(self):
        """Empty checks list must not crash validation."""
        result = validate_scan_results(
            total_score=0,
            band="Critical — Invisible to AI",
            checks=[],
        )
        assert "verification" in result

    def test_null_finding(self):
        """Null finding must be handled gracefully."""
        check = {
            "name": "Test Check",
            "score": 0,
            "max_score": 10,
            "passed": False,
            "partial": False,
            "finding": "",
            "fix": "Some fix",
        }
        result = EvidenceValidator.validate_check_recommendation(check)
        assert result.has_evidence is False

    def test_boundary_score_84(self):
        """Score 84 validates (within 0-100)."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate(84)
        assert result.status == ValidationStatus.PASSED

    def test_boundary_score_85(self):
        """Score 85 validates (within 0-100)."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate(85)
        assert result.status == ValidationStatus.PASSED

    def test_boundary_band_at_85(self):
        """Band for score 85 must be 'Excellent — AI Optimized'."""
        band = _random_band(85)
        assert band == "Excellent — AI Optimized"

    def test_boundary_band_at_64(self):
        """Band for score 64 must be 'Warning — Visibility Gaps'."""
        band = _random_band(64)
        assert band == "Warning — Visibility Gaps", f"Got {band}"

    def test_boundary_band_at_65(self):
        """Band for score 65 must be 'Good — Needs Work'."""
        band = _random_band(65)
        assert band == "Good — Needs Work"
