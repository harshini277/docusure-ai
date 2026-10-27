# DocuSure AI 🛡️
### AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification Platform
**AICTE Regulation Bureau • Technical Institution Approval Scrutiny Workbench**

---

## 🌟 Executive Overview

**DocuSure AI** is an enterprise-grade, evidence-first regulatory scrutiny workbench designed for statutory approval bodies to automate document validation, eliminate institutional educational fraud, and reduce scrutiny backlog while preserving complete legal defensibility.

### 🎯 Core Operational Rule: "AI Flags, Officials Decide"
DocuSure AI never issues an automated refusal or blacklisting. Every finding is classified as an **"anomaly: review required"** with an immutable EvidenceGraph connecting:
$$\text{Finding} \longrightarrow \{\text{Document ID}, \text{Page Number}, \text{Bounding Box}, \text{Extracted Value}, \text{Rule Version}, \text{Reviewer Decision}\}$$

---

## ⚡ The Decoupled Three-Signal Verification Architecture

The system enforces strict separation of concerns across three independent verification signals:

| Signal Dimension | Target Assessment | Verification Method & Regulatory Guarantee |
| :--- | :--- | :--- |
| **Signal 1: Extraction Quality** | *Did we read it correctly?* | Vector PDF text extraction + PaddleOCR coordinate mapping with per-character confidence metrics. |
| **Signal 2: Cross-Doc Consistency** | *Do values agree across documents & rules?* | Deterministic cross-checks (e.g., Land Title Deed vs Application Form vs APH Norms; 1:20 Faculty-to-Student Ratio). |
| **Signal 3: Authoritative Verification** | *Did the issuing authority confirm it?* | Direct gateway & QR check (DigiLocker, State Land Bhoomi/e-Dharti, Fire Dept NOC). **Graceful degradation: no API $\rightarrow$ "Pending / Manual Review", never a silent pass.** |

---

## 🛡️ Advanced Capabilities

1. **Cross-Institution "Ghost Faculty" Collision Network**:
   Cross-indexes masked faculty identifier hashes across all active applications nationwide to flag professors concurrently listed on rosters at multiple institutions during inspection season.
2. **Regulatory Version Replay & Back-Testing Engine**:
   Replays evidence against historical rule versions (e.g., APH 2023–24 vs 2024–27) for 100% legally reproducible appeals and court inquiries.
3. **Interactive Forensic ELA (Error Level Analysis) Heatmap**:
   Real-time thermal compression overlay detecting digital image manipulation (Photoshop/Canva text overlays) on scanned government NOCs and stamps.
4. **Applicant Pre-Flight Compliance Sandbox (Shift-Left)**:
   A self-service sandbox allowing institutions to validate draft bundles before payment, eliminating 60% of avoidable resubmission cycles.
5. **Offline Cryptographic QR Verification Seal**:
   Ed25519-signed Merkle-root QR seal on approved Scrutiny Dossiers, verifiable offline on mobile by visiting Expert Inspection Committees.
6. **Digital Twin Campus Spatial Consistency Auditor**:
   Cross-checks architectural room areas against municipal completion permits to prevent structural exaggerations.

---

## 🚀 Quick Start Guide

### 1. Launch Interactive Frontend Workbench
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

**Frontend Capabilities**:
- 🌓 **Light / Dark Mode Toggle** with smooth transitions and persistent state.
- 🧑‍💼 **Role Switcher**: Scrutiny Officer (Level 1), Committee Chairman (Level 2), Applicant (Pre-Flight Mode), Vigilance Auditor.
- 📁 **Scrutiny Queue**: High-level KPI impact cards, risk meters, and category filters.
- 🔍 **Evidence Workbench**: Split-screen viewer with zoom/pan, **Forensic ELA Heatmap Toggle**, bounding box overlays, and Three-Signal inspector.
- 🔬 **Forensics & Integrity Lab**: Ghost faculty collision resolver, NIST SHA-256 duplicate indexer, and Canva metadata inspection.
- ⚙️ **APH Rule Matrix**: Interactive Faculty-to-Student Ratio (FSR) & Land Area Norm Calculator.
- 📜 **Audit Ledger**: Append-only SHA-256 chained block ledger.
- 📄 **Export Scrutiny Dossier**: Printable official AICTE summary with cryptographic QR seal.

### 2. Run Python FastAPI Backend & Rule Engine
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

### 3. Run Automated Backend Tests
```bash
python -c "import test_api; test_api.test_land_norm_evaluation(); test_api.test_fsr_evaluation(); test_api.test_audit_block_hashing(); print('ALL TESTS PASSED')"
```

---

## 🔒 Security & Data Governance Highlights
- **DPDP Act 2023 & Aadhaar Compliance**: Automatic regex masking of Aadhaar ($XXXX-XXXX-1234$), PAN, and personal phone numbers.
- **Append-Only Tamper Evidence**: Reviewer overrides and decisions are cryptographically chained via SHA-256 block hashing.
- **Zero Raw Public URLs**: Documents accessed exclusively through short-lived (15-min) presigned cryptographic tokens.
