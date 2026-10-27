export type ThreeSignalStatus = {
  extractionQuality: number; // 0-100%
  extractionConfidence: 'High' | 'Medium' | 'Low';
  consistencyStatus: 'Consistent' | 'Mismatch' | 'Incomplete';
  authoritativeStatus: 'Source verified' | 'Pending / unavailable' | 'Manual review' | 'Revoked / Tampered';
  authoritativeSource: string;
};

export type BoundingBox = {
  page: number;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width: number;
  height: number;
  label: string;
  type: 'match' | 'mismatch' | 'tampered' | 'info';
};

export type ReviewerDecision = 'PENDING' | 'ACCEPTED' | 'FLAGGED' | 'OVERRIDDEN' | 'CLARIFICATION_REQUESTED';

export type EvidenceNode = {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleVersion: string;
  docId: string;
  docTitle: string;
  page: number;
  boundingBox: BoundingBox;
  claimedValue: string;
  extractedValue: string;
  authoritativeValue?: string;
  status: 'consistent' | 'mismatch' | 'anomaly' | 'pending' | 'verified';
  signal1Score: number;
  signal2Result: string;
  signal3Result: string;
  recommendedAction: string;
  reviewerDecision: ReviewerDecision;
  reviewerNotes?: string;
  severity: 'low' | 'medium' | 'critical';
};

export type CaseDocument = {
  id: string;
  title: string;
  category: 'Application Form' | 'Land Title Deed' | 'Building Plan & Approval' | 'Fire Safety NOC' | 'Faculty Roster' | 'Financial Audit & FDR';
  fileName: string;
  fileSize: string;
  pagesCount: number;
  sha256: string;
  duplicateDetected: boolean;
  duplicateCaseId?: string;
  elaScore: number; // 0-100% ELA anomaly score
  metadataAlert?: string;
  pdfProducer?: string;
  creationDate?: string;
  extractedFields: Record<string, { value: string; confidence: number; page: number }>;
  pagesContent: { page: number; title: string; lines: string[]; bboxes: BoundingBox[] }[];
};

export type GhostFacultyConflict = {
  facultyName: string;
  designation: string;
  department: string;
  panMasked: string;
  matchedCaseId: string;
  matchedCollegeName: string;
  conflictType: 'Simultaneous Full-Time Appointment' | 'Duplicate Aadhaar Hash';
  riskScore: number;
};

export type AuditBlock = {
  id: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  action: string;
  details: string;
  ruleVersion: string;
  prevHash: string;
  blockHash: string;
};

export type CaseApplication = {
  id: string;
  instituteName: string;
  applicantSociety: string;
  location: string;
  state: string;
  category: 'New Technical Institution' | 'Extension of Approval (EoA)' | 'Increase in Intake' | 'Addition of New Discipline';
  submissionDate: string;
  currentRiskScore: number;
  riskTier: 'Low' | 'Medium' | 'Critical Anomaly';
  overallStatus: 'In Scrutiny' | 'Anomalies Flagged' | 'Provisionally Cleared' | 'Notice Issued' | 'Rejected';
  documents: CaseDocument[];
  findings: EvidenceNode[];
  auditLog: AuditBlock[];
  ghostFacultyConflicts: GhostFacultyConflict[];
  academicStats: {
    intake: number;
    requiredFaculty: number;
    extractedFaculty: number;
    ratio: string;
    requiredRatio: string;
    landClaimedAcres: number;
    landVerifiedAcres: number;
    requiredLandAcres: number;
    builtUpAreaSqM: number;
    requiredBuiltUpAreaSqM: number;
  };
};

export type UserRole = 'Scrutiny Officer' | 'Applicant / College Admin' | 'Committee Chairman' | 'Vigilance Auditor';
