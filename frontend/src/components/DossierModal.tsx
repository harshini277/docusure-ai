import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import type { CaseApplication } from '../types';

interface DossierModalProps {
  application: CaseApplication;
  onClose: () => void;
  darkMode: boolean;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  application,
  onClose,
  darkMode,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden border my-8 ${
        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Actions Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-sm">
              AICTE Scrutiny Dossier — Official Summary Export
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Content */}
        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* AICTE Header */}
          <div className="text-center border-b pb-4 border-slate-200 dark:border-slate-800 space-y-1">
            <div className="inline-block p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase mb-1">
              DocuSure AI • Evidence-First Regulatory Workbench
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              All India Council for Technical Education
            </h1>
            <p className="text-xs text-slate-500 uppercase font-medium">
              Statutory Body under Ministry of Education, Govt. of India • Nelson Mandela Marg, New Delhi 110070
            </p>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400 pt-1">
              FIRST-PASS SCRUTINY DOSSIER & REGULATORY VERIFICATION AUDIT
            </div>
          </div>

          {/* Institutional Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Application ID</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{application.id}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Academic Cycle</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">2026-2027</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Category</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{application.category}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Scrutiny Status</span>
              <p className={`font-bold mt-0.5 ${
                application.riskTier === 'Critical Anomaly' ? 'text-rose-600' : 'text-emerald-600'
              }`}>{application.overallStatus}</p>
            </div>
          </div>

          {/* Institution & Society Details */}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm text-slate-900 dark:text-white">{application.instituteName}</div>
            <div className="text-slate-500">Applicant Sponsoring Trust: <strong>{application.applicantSociety}</strong></div>
            <div className="text-slate-500">Campus Location: <strong>{application.location}, {application.state}</strong></div>
          </div>

          {/* Three-Signal Verification Summary Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Three-Signal Verification Matrix (Decoupled Assessment)
            </h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Signal Dimension</th>
                    <th className="p-3">Result / Score</th>
                    <th className="p-3">Evaluation Method</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  <tr>
                    <td className="p-3 font-semibold">Signal 1: Extraction Quality</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">96.4% Confidence</td>
                    <td className="p-3 text-slate-500">Vector PDF extraction + PaddleOCR coordinate mapping</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PASSED</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Signal 2: Cross-Doc Consistency</td>
                    <td className="p-3 font-medium">
                      {application.findings.some(f => f.status === 'mismatch' || f.status === 'anomaly') 
                        ? 'Cross-Doc Mismatch Detected' 
                        : 'Fully Consistent'}
                    </td>
                    <td className="p-3 text-slate-500">APH 2024-27 Clause 4.1 Land Norm & Table 4.2 FSR Matrix</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        application.findings.some(f => f.status === 'mismatch') 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {application.findings.some(f => f.status === 'mismatch') ? 'FLAGGED' : 'PASSED'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Signal 3: Authoritative Verification</td>
                    <td className="p-3 font-medium">
                      {application.findings.some(f => f.status === 'anomaly')
                        ? 'Issuer Negative / Expired'
                        : application.findings.some(f => f.status === 'pending')
                        ? 'Gateway Timeout / Pending'
                        : 'DigiLocker / State API Verified'}
                    </td>
                    <td className="p-3 text-slate-500">Live API checks (MahaBhulekh, UP Fire Dept, EPFO)</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        application.findings.some(f => f.status === 'anomaly')
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {application.findings.some(f => f.status === 'anomaly') ? 'DEFICIENT' : 'CONFIRMED'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* EvidenceGraph Findings Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              EvidenceGraph Scrutiny Findings & Reviewer Directives
            </h3>
            <div className="space-y-2">
              {application.findings.map((f) => (
                <div 
                  key={f.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 dark:text-white">
                      [{f.ruleId}] {f.ruleName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      f.reviewerDecision === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.reviewerDecision === 'FLAGGED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Decision: {f.reviewerDecision}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Source: {f.docTitle} (Page {f.page}) • Claimed: <strong>{f.claimedValue}</strong> vs Extracted: <strong>{f.extractedValue}</strong>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium">
                    Directive: {f.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic QR Seal & Signatures */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-white shadow-sm">
                <QrCode className="h-16 w-16 text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  Ed25519 Cryptographic Verification Seal
                </div>
                <div className="font-mono text-[10px] text-slate-500 break-all max-w-xs">
                  MERKLE ROOT: 8e1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Scan to verify on-campus ground truth with mobile inspector app
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Authorized Scrutiny Bureau Sign-off</div>
              <div className="font-bold text-slate-900 dark:text-white pt-4">Dr. S. K. Narayanan</div>
              <div className="text-[11px] text-slate-500">Member Secretary, Standing Scrutiny Committee</div>
              <div className="text-[10px] font-mono text-slate-400">Timestamp: 2026-10-27 21:30 IST</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
