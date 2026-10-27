import React, { useState } from 'react';
import { 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Building,
  Sparkles
} from 'lucide-react';

interface ApplicantPreFlightPortalProps {
  darkMode: boolean;
}

export const ApplicantPreFlightPortal: React.FC<ApplicantPreFlightPortalProps> = ({
  darkMode,
}) => {
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [lintCompleted, setLintCompleted] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<'flawed' | 'clean'>('flawed');

  const runPreFlightCheck = () => {
    setAnalyzing(true);
    setLintCompleted(false);
    setTimeout(() => {
      setAnalyzing(false);
      setLintCompleted(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-900/50' : 'bg-gradient-to-r from-emerald-50 via-white to-white border-emerald-200'
      } shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                <Send className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Applicant Pre-Flight Compliance Sandbox (Shift-Left)
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300">
                Self-Service Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Allows college administrators and sponsoring trusts to run private compliance linting before paying regulatory scrutiny fees. Eliminates 60% of avoidable resubmission cycles.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Operational Metric:</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
              &gt;40% Less Manual Effort
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Simulation Zone (6 Cols) */}
        <div className={`lg:col-span-6 rounded-2xl border p-6 space-y-4 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulated Draft Application Upload
            </h3>
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setSelectedPreset('flawed')}
                className={`px-2 py-1 rounded font-medium ${
                  selectedPreset === 'flawed'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-500'
                }`}
              >
                Draft with Deficiencies
              </button>
              <button
                onClick={() => setSelectedPreset('clean')}
                className={`px-2 py-1 rounded font-medium ${
                  selectedPreset === 'clean'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-500'
                }`}
              >
                Compliant Draft
              </button>
            </div>
          </div>

          {/* Drag & Drop Box */}
          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            darkMode ? 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
          }`}>
            <UploadCloud className="h-10 w-10 mx-auto text-slate-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {selectedPreset === 'flawed' ? 'Draft_Bundle_Apex_Engineering_Draft.zip (17.6 MB)' : 'Compliant_Bundle_Bharati_Univ.zip (14.2 MB)'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Ready for pre-flight AI validation across all 5 modules of AICTE Handbook
            </p>

            <button
              onClick={runPreFlightCheck}
              disabled={analyzing}
              className="mt-4 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Linting Rules & Integrity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run Pre-Flight Scrutiny Linter</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Pre-Flight Privacy Guarantee:
            </div>
            <p className="text-[11px]">
              Draft files uploaded to this sandbox are processed ephemerally in RAM and are <strong>never</strong> recorded in the official AICTE scrutiny ledger or penalty database.
            </p>
          </div>
        </div>

        {/* Linter Diagnostic Report (6 Cols) */}
        <div className={`lg:col-span-6 rounded-2xl border p-6 space-y-4 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <FileCheck className="h-4 w-4 text-emerald-500" />
              <span>Instant Linter Diagnostics</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Engine: DocuSure Linter v2.3
            </span>
          </div>

          {!lintCompleted && !analyzing && (
            <div className="py-16 text-center text-xs text-slate-400">
              Click "Run Pre-Flight Scrutiny Linter" to simulate pre-submission validation.
            </div>
          )}

          {analyzing && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="h-8 w-8 mx-auto text-emerald-500 animate-spin" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Checking Land Parcel Contiguity, Ratio Deficit & Expiry Dates...
              </div>
            </div>
          )}

          {lintCompleted && selectedPreset === 'flawed' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Pre-Flight Failed: 3 Deficiencies Found</div>
                  <div className="text-[11px] mt-0.5 text-rose-700 dark:text-rose-300">
                    If submitted in this condition, your application will receive a formal Scrutiny Defect Notice. Correct these items before submission:
                  </div>
                </div>
              </div>

              {/* Finding 1 */}
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>1. Land Area Shortfall (2.30 Acres Deficit)</span>
                  <span className="text-[10px] text-rose-500 font-mono">APH Clause 4.1</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Application claims 7.50 Acres, but attached Sub-Registrar Deed 9102 conveys only 5.20 Acres. Disputed parcel 2.30 Acres is unregistered.
                </p>
                <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Fix: Attach registered conveyance deed for remaining 2.30 Acres before final submission.
                </div>
              </div>

              {/* Finding 2 */}
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>2. Faculty-to-Student Ratio Deficit (1:27.7 vs 1:20)</span>
                  <span className="text-[10px] text-rose-500 font-mono">APH Table 4.2</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  For 360 applied seats in Engineering, AICTE mandates 18 verified faculty. Your roster contains only 13 verified faculty.
                </p>
                <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Fix: Add appointment orders and EPFO UAN for 5 additional Assistant Professors.
                </div>
              </div>

              {/* Finding 3 */}
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>3. State Fire Services NOC Expired</span>
                  <span className="text-[10px] text-rose-500 font-mono">APH Clause 3.4</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Attached NOC record UPFS/GBN/NOC/2023/4412 expired on 15-Mar-2023. Digital date overlay is unverified.
                </p>
                <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Fix: Obtain and attach official provisional renewal receipt from Chief Fire Officer.
                </div>
              </div>
            </div>
          )}

          {lintCompleted && selectedPreset === 'clean' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Pre-Flight Passed: 100% Ready for Submission</div>
                  <div className="text-[11px] mt-0.5 text-emerald-700 dark:text-emerald-300">
                    All mandatory documents, land contiguity norms, faculty ratios, and DigiLocker certificates are validated.
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Passed Compliance Checklist:
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>✓ Land Title: 10.40 Acres verified via MahaBhulekh API</div>
                  <div>✓ Faculty Ratio: 1:19.2 (Exceeds mandatory 1:20 norm)</div>
                  <div>✓ Fire NOC: Valid through 2028 with active digital signature</div>
                  <div>✓ Built-up Area: 28,400 Sq.M (Exceeds 22,000 Sq.M requirement)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
