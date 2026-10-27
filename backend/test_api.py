from rules_engine import RulesEngine

def test_land_norm_evaluation():
    engine = RulesEngine()
    # Urban campus requires 4.0 Acres. If verified is 5.2 Acres -> PASS
    res = engine.evaluate_land_norm(claimed_acres=5.2, verified_acres=5.2, location_type='URBAN')
    assert res["status"] == "verified"
    assert res["deficit_acres"] == 0.0

    # Rural campus requires 7.5 Acres. If verified is 5.2 Acres -> DEFICIT
    res_deficit = engine.evaluate_land_norm(claimed_acres=7.5, verified_acres=5.2, location_type='RURAL')
    assert res_deficit["status"] == "mismatch"
    assert res_deficit["deficit_acres"] == 2.3

def test_fsr_evaluation():
    engine = RulesEngine()
    # 360 intake at 1:20 requires 18 faculty. With 13 faculty -> Deficit of 5
    res = engine.evaluate_fsr(intake=360, faculty_count=13, level="UG")
    assert res["status"] == "mismatch"
    assert res["deficit_count"] == 5
    assert res["actual_ratio"] == "1:27.7"

    # 480 intake at 1:20 requires 24 faculty. With 25 faculty -> Compliant
    res_pass = engine.evaluate_fsr(intake=480, faculty_count=25, level="UG")
    assert res_pass["status"] == "verified"
    assert res_pass["deficit_count"] == 0

def test_audit_block_hashing():
    engine = RulesEngine()
    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    data = {"officer": "Dr. Narayanan", "decision": "FLAGGED", "timestamp": "2026-10-27T21:30:00Z"}
    block_hash = engine.calculate_audit_block_hash(prev_hash, data)
    assert len(block_hash) == 64  # SHA-256 length
    assert isinstance(block_hash, str)
