# Verification framework — Product integrity layer.
# Every metric displayed to users must pass validation before it can render.
# Pattern: Evidence → Calculation → Validation → Display

from .contracts import MetricContract, ValidationResult, MetricInventory
from .validators import MetricValidator
from .evidence import EvidenceValidator
from .integration import validate_scan_results

__all__ = [
    "MetricContract",
    "ValidationResult",
    "MetricInventory",
    "MetricValidator",
    "EvidenceValidator",
    "validate_scan_results",
]
