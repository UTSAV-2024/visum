"""
Validation Tests — Verifies every metric contract and validator.

Tests that:
  - All 20+ metric contracts are registered
  - Each contract accepts valid values
  - Each contract rejects invalid values
  - Blocking failures prevent rendering
  - Warnings allow rendering
  - Evidence validation works correctly
"""

import pytest
from app.validation.contracts import (
    MetricContract,
    MetricInventory,
    ValidationResult,
    ValidationStatus,
    ValidationSeverity,
)
from app.validation.validators import MetricValidator
from app.validation.evidence import EvidenceValidator
from app.validation.integration import validate_scan_results


# ════════════════════════════════════════════════════════════════════
# CONTRACT TESTS
# ════════════════════════════════════════════════════════════════════


class TestMetricContracts:
    """Verify that all metric contracts are properly registered."""

    def test_all_contracts_registered(self):
        """All expected metrics must have contracts."""
        contracts = MetricInventory.all()
        names = {c.name for c in contracts}

        expected = {
            "total_score",
            "band",
            "scan_confidence",
            "dimension_scores",
            "projected_score",
            "recoverable_points",
            "scan_time_ms",
            "upgrade_cta",
            "priority_fixes",
        }
        # Agent compatibilities
        for agent in ["chatgpt", "claude", "perplexity", "cursor", "gemini"]:
            expected.add(f"compatibility_{agent}")
        # Journey stages
        for stage in ["discovery", "understanding", "citation", "interaction"]:
            expected.add(f"journey_{stage}")
        # Check results (sanitized names matching validators.py sanitization logic:
        # name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')
        for check in [
            "ai_bot_permissions_robotstxt",
            "json-ld_structured_data",
            "llmstxt_file",
            "mcp_endpoint",
            "javascript_rendering",
            "meta_tags_and_open_graph",
            "sitemapxml",
            "page_load_speed",
        ]:
            expected.add(f"check_{check}")

        for name in expected:
            assert name in names, f"Missing contract: {name}"
        assert len(contracts) >= len(expected)

    def test_contract_required_fields(self):
        """Every contract must have all required fields."""
        for contract in MetricInventory.all():
            assert contract.name, f"Contract missing name"
            assert contract.display_name, f"Contract {contract.name} missing display_name"
            assert contract.description, f"Contract {contract.name} missing description"
            assert contract.source, f"Contract {contract.name} missing source"
            assert len(contract.required_inputs) >= 0
            assert len(contract.rules) > 0, f"Contract {contract.name} has no rules"
            assert contract.failure_behaviour, f"Contract {contract.name} missing failure_behaviour"

    def test_total_score_valid(self):
        """total_score must accept valid values."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate(75)
        assert result.status == ValidationStatus.PASSED
        assert result.can_render is True

    def test_total_score_invalid_type(self):
        """total_score must reject non-integers."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate("75")
        assert result.status == ValidationStatus.FAILED
        assert result.can_render is False

    def test_total_score_out_of_range(self):
        """total_score must reject values outside 0-100."""
        contract = MetricInventory.get("total_score")
        assert contract is not None
        result = contract.validate(150)
        assert result.status == ValidationStatus.FAILED
        assert result.can_render is False
        assert any("between 0 and 100" in e for e in result.errors)

        result = contract.validate(-1)
        assert result.status == ValidationStatus.FAILED

    def test_band_valid(self):
        """band must accept valid band strings."""
        contract = MetricInventory.get("band")
        assert contract is not None
        for band in ["Excellent — AI Optimized", "Good — Needs Work", "Warning — Visibility Gaps", "Critical — Invisible to AI"]:
            result = contract.validate(band)
            assert result.status == ValidationStatus.PASSED, f"Failed for band: {band}"

    def test_band_invalid(self):
        """band must reject invalid band strings."""
        contract = MetricInventory.get("band")
        assert contract is not None
        result = contract.validate("Invalid-Band")
        assert result.status == ValidationStatus.FAILED
        assert result.can_render is False

    def test_scan_confidence_valid(self):
        """scan_confidence must accept valid values."""
        contract = MetricInventory.get("scan_confidence")
        assert contract is not None
        result = contract.validate(85)
        assert result.status == ValidationStatus.PASSED

    def test_scan_confidence_invalid(self):
        """scan_confidence must reject out-of-range."""
        contract = MetricInventory.get("scan_confidence")
        assert contract is not None
        result = contract.validate(101)
        assert result.status == ValidationStatus.FAILED

    def test_compatibility_valid(self):
        """Compatibility scores must accept 0-100."""
        for agent in ["chatgpt", "claude", "perplexity", "cursor", "gemini"]:
            contract = MetricInventory.get(f"compatibility_{agent}")
            assert contract is not None, f"Missing contract for {agent}"
            result = contract.validate(75)
            assert result.status == ValidationStatus.PASSED, f"Failed for {agent}"
            result = contract.validate(-5)
            assert result.status == ValidationStatus.FAILED, f"Should fail for negative {agent}"
            result = contract.validate(105)
            assert result.status == ValidationStatus.FAILED, f"Should fail for >100 {agent}"

    def test_journey_valid(self):
        """Journey scores must accept 0-100."""
        for stage in ["discovery", "understanding", "citation", "interaction"]:
            contract = MetricInventory.get(f"journey_{stage}")
            assert contract is not None, f"Missing contract for {stage}"
            result = contract.validate(50)
            assert result.status == ValidationStatus.PASSED, f"Failed for {stage}"
            result = contract.validate(101)
            assert result.status == ValidationStatus.FAILED, f"Should fail for >100 {stage}"

    def test_projected_score_relationship(self):
        """Projected score must be >= current score."""
        contract = MetricInventory.get("projected_score")
        assert contract is not None
        # The contract validates range, but relationship is checked separately
        result = contract.validate(85)
        assert result.status == ValidationStatus.PASSED
        result = contract.validate(101)
        assert result.status == ValidationStatus.FAILED


# ════════════════════════════════════════════════════════════════════
# EVIDENCE TESTS
# ════════════════════════════════════════════════════════════════════


class TestEvidenceValidation:
    """Verify that evidence validation works correctly."""

    def test_failed_check_with_evidence(self):
        """A failed check with specific evidence should be valid."""
        check = {
            "name": "JSON-LD Structured Data",
            "score": 0,
            "max_score": 20,
            "passed": False,
            "partial": False,
            "finding": "No JSON-LD structured data found in page HTML. 0 schemas detected.",
            "fix": "Add JSON-LD schema markup to your page. Start with Organization schema.",
        }
        result = EvidenceValidator.validate_check_recommendation(check)
        assert result.has_evidence is True
        assert len(result.evidence_items) >= 2

    def test_failed_check_no_evidence(self):
        """A failed check with generic finding should be invalid."""
        check = {
            "name": "Page Load Speed",
            "score": 0,
            "max_score": 10,
            "passed": False,
            "partial": False,
            "finding": "Could not fetch page speed data",
            "fix": "Ensure your page is accessible.",
        }
        result = EvidenceValidator.validate_check_recommendation(check)
        assert result.has_evidence is False

    def test_passed_check_no_evidence_needed(self):
        """Passed checks don't need evidence."""
        check = {
            "name": "Sitemap.xml",
            "score": 5,
            "max_score": 5,
            "passed": True,
            "partial": False,
            "finding": "Valid sitemap with 10 URLs and lastmod dates.",
            "fix": "Sitemap is correctly configured.",
        }
        result = EvidenceValidator.validate_check_recommendation(check)
        # Passed checks don't generate recommendations
        assert result.has_evidence is False

    def test_evidence_all_checks(self):
        """Validate evidence for multiple checks."""
        checks = [
            {
                "name": "JSON-LD Structured Data",
                "score": 0,
                "max_score": 20,
                "passed": False,
                "partial": False,
                "finding": "No JSON-LD found. 0 schemas detected.",
                "fix": "Add Organization schema markup.",
            },
            {
                "name": "Sitemap.xml",
                "score": 5,
                "max_score": 5,
                "passed": True,
                "partial": False,
                "finding": "Valid sitemap found.",
                "fix": "Keep sitemap updated.",
            },
        ]
        results = EvidenceValidator.validate_all_checks(checks)
        assert "JSON-LD Structured Data" in results
        assert "Sitemap.xml" in results

    def test_get_renderable_recommendations(self):
        """Only checks with evidence should be renderable."""
        checks = [
            {
                "name": "JSON-LD Structured Data",
                "score": 0,
                "max_score": 20,
                "passed": False,
                "partial": False,
                "finding": "No JSON-LD found. 0 schemas detected.",
                "fix": "Add Organization schema markup.",
            },
            {
                "name": "Page Load Speed",
                "score": 0,
                "max_score": 10,
                "passed": False,
                "partial": False,
                "finding": "Could not fetch speed data",
                "fix": "Ensure your page is accessible.",
            },
            {
                "name": "Sitemap.xml",
                "score": 5,
                "max_score": 5,
                "passed": True,
                "partial": False,
                "finding": "Valid sitemap.",
                "fix": "Keep sitemap updated.",
            },
        ]
        renderable = EvidenceValidator.get_renderable_recommendations(checks)
        names = [c["name"] for c in renderable]
        # JSON-LD has evidence, should be included
        assert "JSON-LD Structured Data" in names
        # Sitemap passed, should be included
        assert "Sitemap.xml" in names
        # Page Load Speed has no evidence, should be excluded
        assert "Page Load Speed" not in names


# ════════════════════════════════════════════════════════════════════
# METRIC VALIDATOR TESTS
# ════════════════════════════════════════════════════════════════════


class TestMetricValidator:
    """Verify the MetricValidator orchestrator."""

    def test_validate_scan_result(self):
        """Validate a complete scan result."""
        checks = [
            {"name": "A", "score": 10, "max_score": 15, "passed": True, "finding": "OK"},
            {"name": "B", "score": 0, "max_score": 20, "passed": False, "finding": "Missing data"},
        ]
        result = MetricValidator.validate_scan_result(
            total_score=10,
            band="Critical — Invisible to AI",
            checks=checks,
        )
        assert "total_score" in result
        assert result["total_score"]["can_render"] is True
        assert "band" in result

    def test_filter_renderable(self):
        """Only renderable metrics should pass filter."""
        validations = {
            "total_score": {"can_render": True, "status": "passed", "errors": []},
            "band": {"can_render": False, "status": "failed", "errors": ["Invalid band"]},
        }
        renderable = MetricValidator.filter_renderable(validations)
        assert "total_score" in renderable
        assert "band" not in renderable

    def test_can_render_metric(self):
        """can_render_metric should return correct boolean."""
        assert MetricValidator.can_render_metric("test", {"can_render": True, "errors": []}) is True
        assert MetricValidator.can_render_metric("test", {"can_render": False, "errors": ["err"]}) is False
        assert MetricValidator.can_render_metric("test", None) is False


# ════════════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ════════════════════════════════════════════════════════════════════


class TestValidationIntegration:
    """Verify the end-to-end validation pipeline."""

    def test_validate_scan_results_full(self):
        """Full pipeline validation of scan results."""
        checks = [
            {
                "name": "AI Bot Permissions (robots.txt)",
                "score": 15,
                "max_score": 15,
                "passed": True,
                "partial": False,
                "finding": "All AI crawlers permitted.",
                "fix": "No action needed.",
            },
            {
                "name": "JSON-LD Structured Data",
                "score": 0,
                "max_score": 20,
                "passed": False,
                "partial": False,
                "finding": "No JSON-LD found. 0 schemas detected.",
                "fix": "Add Organization schema markup.",
            },
            {
                "name": "Sitemap.xml",
                "score": 5,
                "max_score": 5,
                "passed": True,
                "partial": False,
                "finding": "Valid sitemap.",
                "fix": "Keep updated.",
            },
            {
                "name": "Page Load Speed",
                "score": 5,
                "max_score": 10,
                "passed": False,
                "partial": True,
                "finding": "Moderate load time: 2500ms total.",
                "fix": "Optimise images and use CDN.",
            },
        ]

        result = validate_scan_results(
            total_score=25,
            band="Critical — Invisible to AI",
            checks=checks,
            scan_confidence=75,
            projected_score=70,
            recoverable_points=45,
        )

        # Should have verification metadata
        assert "verification" in result
        v = result["verification"]

        # Overall render check
        assert "can_render_overall" in v
        assert "metric_validations" in v
        assert "evidence_validations" in v

        # Evidence should pass for checks with real data
        ev = v["evidence_validations"]
        assert ev["JSON-LD Structured Data"]["has_evidence"] is True
        # Page Load Speed has numbers in finding, should have evidence
        assert ev["Page Load Speed"]["has_evidence"] is True

    def test_validation_rejects_broken_data(self):
        """Validation should flag clearly broken data."""
        result = validate_scan_results(
            total_score=-5,
            band="Not-A-Real-Band",
            checks=[],
        )
        v = result["verification"]
        mv = v["metric_validations"]

        # total_score should fail (negative)
        assert mv.get("total_score", {}).get("can_render") is False

        # band should fail (invalid)
        assert mv.get("band", {}).get("can_render") is False
