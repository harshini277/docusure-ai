from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime
import yaml

from schemas import (
    ScrutinyCase, 
    DecisionRequest, 
    ReviewerDecision, 
    PreFlightRequest,
    AuditBlock
)
from rules_engine import RulesEngine

app = FastAPI(
    title="DocuSure AI Backend",
    description="Evidence-First AICTE Scrutiny & Regulatory Compliance Workbench",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RulesEngine(rule_version="APH-2024-27-v2.3.1")

# In-memory cases database seeded with representative technical institutional bundles
CASES_DB: Dict[str, Dict[str, Any]] = {
    "AICTE-2026-N-49218": {
        "id": "AICTE-2026-N-49218",
        "institute_name": "Apex Institute of Technology & Science",
        "applicant_society": "Vidyapeeth Educational Trust",
        "location": "Knowledge Park III, Greater Noida",
        "state": "Uttar Pradesh",
        "category": "New Technical Institution",
        "submission_date": "2026-10-18",
        "current_risk_score": 84,
        "risk_tier": "Critical Anomaly",
        "overall_status": "Anomalies Flagged",
        "academic_stats": {
            "intake": 360,
            "required_faculty": 18,
            "extracted_faculty": 13,
            "ratio": "1:27.7",
            "required_ratio": "1:20",
            "land_claimed_acres": 7.5,
            "land_verified_acres": 5.2,
            "required_land_acres": 7.5
        },
        "ghost_faculty_conflicts": [
            {
                "faculty_name": "Dr. Alok Mathur",
                "designation": "Professor & Head (CSE)",
                "department": "Computer Science & Engg",
                "pan_masked": "ABCXX7891K",
                "matched_case_id": "AICTE-2026-E-26099",
                "matched_college_name": "Shri Ram Institute of Science, Indore (MP)",
                "conflict_type": "Simultaneous Full-Time Appointment",
                "risk_score": 98.0
            }
        ],
        "findings": [
            {
                "id": "FND-01",
                "rule_id": "AICTE-APH-2024-27-R4.1-LAND",
                "rule_name": "Contiguous Land Norm for Technical Campus",
                "rule_version": "APH 2024-27 v2.3.1",
                "doc_id": "DOC-02",
                "doc_title": "Registered Land Title Deed (Khasra Extract)",
                "page": 3,
                "bounding_box": {"page": 3, "x": 12, "y": 48, "width": 76, "height": 14, "label": "Land 5.20 Acres", "type": "mismatch"},
                "claimed_value": "7.50 Acres",
                "extracted_value": "5.20 Acres in registered title deed",
                "authoritative_value": "5.20 Acres (UP Revenue Bhulekh Record #412)",
                "status": "mismatch",
                "signal1_score": 95.0,
                "signal2_result": "Mismatch: Application claims 7.50 Acres, but registered sale deed establishes only 5.20 Acres.",
                "signal3_result": "UP Bhulekh confirms 5.20 Acres registered to trust. Remaining 2.30 acres unregistered.",
                "recommended_action": "Issue scrutiny deficiency notice: Land shortfall of 2.30 Acres.",
                "reviewer_decision": "PENDING",
                "reviewer_notes": "",
                "severity": "critical"
            }
        ],
        "audit_log": [
            {
                "id": "AUD-101",
                "timestamp": "2026-10-18T10:14:22Z",
                "officer_name": "System Engine",
                "officer_role": "Automated Ingestion Pipeline",
                "action": "BUNDLE_INGESTION_COMPLETED",
                "details": "Extracted documents. Generated 4 EvidenceGraph nodes. Flagged 3 anomalies.",
                "rule_version": "APH 2024-27 v2.3.1",
                "prev_hash": "0000000000000000000000000000000000000000000000000000000000000000",
                "block_hash": "7c9f8a61b2e4d5c9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3"
            }
        ]
    }
}

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "DocuSure AI Regulatory Scrutiny Backend",
        "platform": "DocuSure Enterprise",
        "tier": "Production MVP",
        "active_rule_version": engine.rule_version
    }

@app.get("/api/cases")
def list_cases():
    return list(CASES_DB.values())

@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    if case_id not in CASES_DB:
        raise HTTPException(status_code=404, detail="Case not found")
    return CASES_DB[case_id]

@app.post("/api/cases/{case_id}/findings/{finding_id}/decision")
def record_decision(case_id: str, finding_id: str, req: DecisionRequest):
    if case_id not in CASES_DB:
        raise HTTPException(status_code=404, detail="Case not found")
    
    app_case = CASES_DB[case_id]
    target_finding = next((f for f in app_case["findings"] if f["id"] == finding_id), None)
    
    if not target_finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    target_finding["reviewer_decision"] = req.decision.value
    target_finding["reviewer_notes"] = req.notes

    # Append to cryptographic audit trail
    last_block = app_case["audit_log"][-1]
    prev_hash = last_block["block_hash"]
    block_data = {
        "case_id": case_id,
        "finding_id": finding_id,
        "decision": req.decision.value,
        "notes": req.notes,
        "officer": req.officer_name,
        "timestamp": datetime.utcnow().isoformat()
    }
    new_hash = engine.calculate_audit_block_hash(prev_hash, block_data)

    new_block = {
        "id": f"AUD-{len(app_case['audit_log']) + 101}",
        "timestamp": datetime.utcnow().isoformat(),
        "officer_name": req.officer_name,
        "officer_role": req.officer_role,
        "action": f"DECISION_{req.decision.value}",
        "details": f"Officer updated finding {finding_id}. Decision: {req.decision.value}. Note: {req.notes or 'None'}",
        "rule_version": engine.rule_version,
        "prev_hash": prev_hash,
        "block_hash": new_hash
    }
    app_case["audit_log"].append(new_block)

    return {
        "status": "success",
        "finding": target_finding,
        "audit_block": new_block
    }

@app.post("/api/preflight/lint")
def run_preflight_linter(req: PreFlightRequest):
    land_res = engine.evaluate_land_norm(req.claimed_land_acres, req.claimed_land_acres, req.location_type)
    fsr_res = engine.evaluate_fsr(req.claimed_intake, req.verified_faculty_count)

    deficiencies = []
    if land_res["status"] == "mismatch":
        deficiencies.append(land_res["message"])
    if fsr_res["status"] == "mismatch":
        deficiencies.append(fsr_res["message"])

    return {
        "institute_name": req.institute_name,
        "preflight_status": "PASSED" if len(deficiencies) == 0 else "DEFICIENCIES_DETECTED",
        "deficiencies_count": len(deficiencies),
        "deficiencies": deficiencies,
        "land_norm_result": land_res,
        "fsr_norm_result": fsr_res
    }

@app.get("/api/forensics/ghost-faculty")
def get_ghost_faculty_collisions():
    collisions = []
    for case in CASES_DB.values():
        for conflict in case.get("ghost_faculty_conflicts", []):
            collisions.append({
                "source_college": case["institute_name"],
                "source_case_id": case["id"],
                **conflict
            })
    return collisions
