import hashlib
import json
from datetime import datetime
from typing import Dict, Any, List

class RulesEngine:
    def __init__(self, rule_version: str = "APH-2024-27-v2.3.1"):
        self.rule_version = rule_version

    def evaluate_land_norm(self, claimed_acres: float, verified_acres: float, location_type: str) -> Dict[str, Any]:
        req_norm = 2.5 if location_type == 'METRO' else (4.0 if location_type == 'URBAN' else 7.5)
        is_deficient = verified_acres < req_norm
        return {
            "rule_id": "AICTE-APH-2024-27-R4.1-LAND",
            "rule_name": "Contiguous Land Norm for Technical Campus",
            "required_acres": req_norm,
            "claimed_acres": claimed_acres,
            "verified_acres": verified_acres,
            "status": "mismatch" if is_deficient else "verified",
            "deficit_acres": max(0.0, req_norm - verified_acres),
            "severity": "critical" if is_deficient else "low",
            "message": f"Verified land {verified_acres} Acres is {'below' if is_deficient else 'meets'} mandatory norm of {req_norm} Acres."
        }

    def evaluate_fsr(self, intake: int, faculty_count: int, level: str = "UG") -> Dict[str, Any]:
        req_ratio = 20 if level == "UG" else 12
        required_faculty = int(intake / req_ratio)
        actual_ratio = round(intake / max(1, faculty_count), 1)
        is_deficient = actual_ratio > req_ratio

        return {
            "rule_id": "AICTE-APH-2024-27-R4.2-FSR",
            "rule_name": "Faculty to Student Ratio (1:20 UG Norm)",
            "required_faculty": required_faculty,
            "verified_faculty": faculty_count,
            "actual_ratio": f"1:{actual_ratio}",
            "required_ratio": f"1:{req_ratio}",
            "status": "mismatch" if is_deficient else "verified",
            "deficit_count": max(0, required_faculty - faculty_count),
            "severity": "medium" if is_deficient else "low",
            "message": f"Faculty-to-student ratio is 1:{actual_ratio} ({'Deficit of ' + str(required_faculty - faculty_count) + ' faculty' if is_deficient else 'Compliant'})."
        }

    def calculate_audit_block_hash(self, prev_hash: str, block_data: Dict[str, Any]) -> str:
        serialized = json.dumps(block_data, sort_keys=True)
        payload = f"{prev_hash}:{serialized}".encode('utf-8')
        return hashlib.sha256(payload).hexdigest()

    def detect_ghost_faculty(self, pan_hash: str, active_rosters: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        collisions = []
        for item in active_rosters:
            if item.get("pan_hash") == pan_hash:
                collisions.append(item)
        return collisions
