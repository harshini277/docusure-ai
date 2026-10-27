from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskTier(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    CRITICAL = "Critical Anomaly"

class FindingStatus(str, Enum):
    CONSISTENT = "consistent"
    MISMATCH = "mismatch"
    ANOMALY = "anomaly"
    PENDING = "pending"
    VERIFIED = "verified"

class ReviewerDecision(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    FLAGGED = "FLAGGED"
    OVERRIDDEN = "OVERRIDDEN"
    CLARIFICATION_REQUESTED = "CLARIFICATION_REQUESTED"

class BoundingBox(BaseModel):
    page: int
    x: float
    y: float
    width: float
    height: float
    label: str
    type: str

class EvidenceNode(BaseModel):
    id: str
    rule_id: str
    rule_name: str
    rule_version: str
    doc_id: str
    doc_title: str
    page: int
    bounding_box: BoundingBox
    claimed_value: str
    extracted_value: str
    authoritative_value: Optional[str] = None
    status: FindingStatus
    signal1_score: float
    signal2_result: str
    signal3_result: str
    recommended_action: str
    reviewer_decision: ReviewerDecision = ReviewerDecision.PENDING
    reviewer_notes: Optional[str] = None
    severity: str

class CaseDocument(BaseModel):
    id: str
    title: str
    category: str
    file_name: str
    file_size: str
    pages_count: int
    sha256: str
    duplicate_detected: bool = False
    duplicate_case_id: Optional[str] = None
    ela_score: float = 0.0
    metadata_alert: Optional[str] = None
    extracted_fields: Dict[str, Any] = {}

class AuditBlock(BaseModel):
    id: str
    timestamp: str
    officer_name: str
    officer_role: str
    action: str
    details: str
    rule_version: str
    prev_hash: str
    block_hash: str

class GhostFacultyConflict(BaseModel):
    faculty_name: str
    designation: str
    department: str
    pan_masked: str
    matched_case_id: str
    matched_college_name: str
    conflict_type: str
    risk_score: float

class ScrutinyCase(BaseModel):
    id: str
    institute_name: str
    applicant_society: str
    location: str
    state: str
    category: str
    submission_date: str
    current_risk_score: int
    risk_tier: RiskTier
    overall_status: str
    academic_stats: Dict[str, Any]
    ghost_faculty_conflicts: List[GhostFacultyConflict] = []
    documents: List[CaseDocument] = []
    findings: List[EvidenceNode] = []
    audit_log: List[AuditBlock] = []

class DecisionRequest(BaseModel):
    decision: ReviewerDecision
    notes: Optional[str] = ""
    officer_name: str = "Dr. S. K. Narayanan"
    officer_role: str = "Scrutiny Officer (Level 1)"

class PreFlightRequest(BaseModel):
    institute_name: str
    category: str
    claimed_intake: int
    claimed_land_acres: float
    location_type: str  # METRO / URBAN / RURAL
    verified_faculty_count: int
    fire_noc_valid_until: str
