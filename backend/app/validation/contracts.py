"""
Verification Contracts — Every metric must have a defined contract.

Each contract specifies:
  - Source: where the metric comes from (backend, frontend, external)
  - Required inputs: what data is needed to compute it
  - Validation rules: type, range, relationship constraints
  - Failure behavior: what happens when validation fails
  - Display behavior: how the metric should be rendered
"""

from dataclasses import dataclass, field
from typing import Any, Callable, Optional
from enum import Enum


class MetricSource(Enum):
    """Where the metric originates."""
    BACKEND_CALCULATED = "backend_calculated"       # Backend scorer.py
    BACKEND_MEASURED = "backend_measured"           # Directly measured (scan, crawl)
    BACKEND_DERIVED = "backend_derived"             # Derived from checks
    FRONTEND_CALCULATED = "frontend_calculated"     # Frontend-only calc
    SYSTEM_CONSTANT = "system_constant"             # Hardcoded system value


class ValidationSeverity(Enum):
    """How critical a validation failure is."""
    BLOCKING = "blocking"       # Metric must not render
    WARNING = "warning"         # Metric can render but flag for review
    INFO = "info"              # Informational only


class ValidationStatus(Enum):
    """Result of a validation check."""
    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class ValidationRule:
    """A single validation rule for a metric."""
    name: str
    description: str
    severity: ValidationSeverity
    validate_fn: Callable[[Any], bool]
    failure_message: str


@dataclass
class ValidationResult:
    """Result of validating a single metric."""
    metric_name: str
    status: ValidationStatus
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    raw_value: Any = None
    validated_value: Any = None

    @property
    def can_render(self) -> bool:
        """Metric can render only if no BLOCKING failures."""
        return len(self.errors) == 0

    def to_dict(self) -> dict:
        return {
            "metric": self.metric_name,
            "status": self.status.value,
            "can_render": self.can_render,
            "errors": self.errors,
            "warnings": self.warnings,
        }


@dataclass
class MetricContract:
    """
    Contract defining how a metric must be verified before display.

    Every metric displayed anywhere in the product must have a contract.
    """
    name: str
    display_name: str
    description: str
    source: MetricSource
    required_inputs: list[str]
    rules: list[ValidationRule]
    failure_behaviour: str
    display_condition: str = "always"
    tooltip: str = ""

    def validate(self, value: Any, context: dict | None = None) -> ValidationResult:
        """Run all validation rules against the value."""
        errors: list[str] = []
        warnings: list[str] = []

        for rule in self.rules:
            try:
                if not rule.validate_fn(value):
                    msg = f"{rule.name}: {rule.failure_message}"
                    if rule.severity == ValidationSeverity.BLOCKING:
                        errors.append(msg)
                    elif rule.severity == ValidationSeverity.WARNING:
                        warnings.append(msg)
            except Exception as e:
                errors.append(f"{rule.name}: validation exception: {str(e)}")

        status = ValidationStatus.FAILED if errors else ValidationStatus.PASSED
        return ValidationResult(
            metric_name=self.name,
            status=status,
            errors=errors,
            warnings=warnings,
            raw_value=value,
            validated_value=value if not errors else None,
        )


class MetricInventory:
    """
    Registry of ALL metric contracts in the product.
    This is the single source of truth for what can be displayed.
    """

    _contracts: dict[str, MetricContract] = {}

    @classmethod
    def register(cls, contract: MetricContract) -> None:
        cls._contracts[contract.name] = contract

    @classmethod
    def get(cls, name: str) -> MetricContract | None:
        return cls._contracts.get(name)

    @classmethod
    def all(cls) -> list[MetricContract]:
        return list(cls._contracts.values())

    @classmethod
    def validate_all(cls, values: dict[str, Any], context: dict | None = None) -> dict[str, ValidationResult]:
        """Validate every registered metric that has a value."""
        results = {}
        for name, contract in cls._contracts.items():
            if name in values:
                results[name] = contract.validate(values[name], context)
            else:
                results[name] = ValidationResult(
                    metric_name=name,
                    status=ValidationStatus.SKIPPED,
                    errors=["No value provided for validation"],
                )
        return results
