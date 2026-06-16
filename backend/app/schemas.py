from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from enum import Enum
 
class ScanStatus(str, Enum):
    PENDING   = "pending"
    RUNNING   = "running"
    COMPLETED = "completed"
    FAILED    = "failed"
 
class CheckResult(BaseModel):
    name:        str
    score:       int        # actual points awarded
    max_score:   int        # maximum possible points
    passed:      bool
    partial:     bool = False
    description: str        # what we checked
    finding:     str        # what we found
    fix:         str        # what the user should do
    details:     dict = {}  # raw data for debugging
 
class ScanResult(BaseModel):
    url:          str
    total_score:  int
    max_score:    int = 100
    band:         str        # "Agent-Ready", "Partially Visible", etc.
    band_message: str        # the marketing copy for this band
    checks:       List[CheckResult]
    scan_time_ms: int
    timestamp:    str
    upgrade_cta:  str        # personalised upgrade prompt
 
class ScanRequest(BaseModel):
    url: str                 # we validate manually, not with HttpUrl
    email: Optional[str] = None  # optional, for follow-up
 
class ScanResponse(BaseModel):
    scan_id: str
    result:  ScanResult
    status:  ScanStatus = ScanStatus.COMPLETED