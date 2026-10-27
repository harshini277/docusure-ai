import React, { useState } from 'react';
import { 
  Fingerprint, 
  AlertOctagon, 
  Hash, 
  Flame, 
  Clock, 
  FileWarning, 
  Sliders, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Copy, 
  Building,
  UserX,
  FileCheck2
} from 'lucide-react';
import type { CaseApplication } from '../types';

interface ForensicLabProps {
  cases: CaseApplication[];
  activeCase: CaseApplication;
  darkMode: boolean;
  onOpenDossier: (c: CaseApplication) => void;
}

export const ForensicLab: React.FC<ForensicLabProps> = ({
  cases,
  activeCase,
  darkMode,
  onOpenDossier,
}) => {
  const [elaSensitivity, setElaSensitivity] = useState<number>(75);
  const [activeTab, setActiveTab] = useState<'ghostFaculty' | 'hashDedupe' | 'elaDeepDive' | 'metadata'>('ghostFaculty');

  // Find all ghost faculty across cases
  const allGhostConflicts = cases.flatMap(c => 
    c.ghostFacultyConflicts.map(g => ({ ...g, sourceCollege: c.instituteName, sourceCaseId: c.id }))
  );

  return (
    <div className="space-y-6">
      {/* Forensic Lab Banner */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border-purple-900/50' : 'bg-gradient-to-r from-purple-50 via-white to-white border-purple-200'
      } shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Forensics & Document Integrity Lab
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/80 dark:text-purple-300">
                AICTE Regulatory Defense
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Detects systemic education malpractices before physical inspection: cross-institution ghost faculty collisions, recycled architectural blueprints, and digital compression tampering in scanned statutory NOCs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Security Suite:</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
              SHA-256 • pHash • ELA • Cross-Index
            </span>
          </div>
        </div>
      </div>

      {/* Forensic Navigation Tabs */}
      <div className="flex space-x-2 border-b border-inherit pb-2 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ghostFaculty')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'ghostFaculty'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserX className="h-4 w-4" />
          <span>Ghost Faculty Network ({allGhostConflicts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hashDedupe')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'hashDedupe'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Hash className="h-4 w-4" />
          <span>Cross-Application Duplicate SHA-256</span>
        </button>

        <button
          onClick={() => setActiveTab('elaDeepDive')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'elaDeepDive'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Error Level Analysis (ELA) Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'metadata'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>PDF Metadata & Timestamp Chronology</span>
        </button>
      </div>

      {/* Tab 1: Ghost Faculty Collision Network */}
      {activeTab === 'ghostFaculty' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border text-xs ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <UserX className="h-4 w-4 text-rose-500" />
              <span>Simultaneous Multi-College Faculty Collision Network</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              DocuSure AI hashes faculty identifiers across all active AICTE application bundles across India. When the same professor or Ph.D. holder is represented on multiple rosters during the same academic scrutiny cycle, a cross-state conflict alert is triggered.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {allGhostConflicts.map((conflict, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-xl border relative overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-rose-900/40' : 'bg-white border-rose-200'
                } shadow-sm`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        Collision Confidence: {conflict.riskScore}%
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Masked Identifier Hash: {conflict.panMasked}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {conflict.facultyName} — {conflict.designation}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                      {/* Institution 1 */}
                      <div className={`p-3 rounded-lg border ${
                        darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Submitted In Application A</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {conflict.sourceCollege}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Case ID: <span className="font-mono">{conflict.sourceCaseId}</span> • Greater Noida (UP)
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                          Claimed: Full-Time Professor & HOD (CSE)
                        </div>
                      </div>

                      {/* Institution 2 */}
                      <div className={`p-3 rounded-lg border ${
                        darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Concurrent Match In Application B</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {conflict.matchedCollegeName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Case ID: <span className="font-mono">{conflict.matchedCaseId}</span> • Indore (MP)
                        </div>
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 font-medium">
                          Claimed: Full-Time Professor & Dean (Academics)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 shrink-0">
                    <button 
                      onClick={() => alert(`Issued Joint Show-Cause Notice to ${conflict.sourceCollege} and ${conflict.matchedCollegeName} regarding dual appointment of ${conflict.facultyName}`)}
                      className="text-xs px-3 py-2 rounded-lg font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span>Issue Dual Show-Cause Notice</span>
                    </button>
                    <button 
                      onClick={() => alert(`Ordered Mandatory Physical Bio-metric Inspection for ${conflict.sourceCollege}`)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Schedule Biometric EVC Inspection
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: SHA-256 Duplicate Blueprint Indexer */}
      {activeTab === 'hashDedupe' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border text-xs ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Hash className="h-4 w-4 text-blue-500" />
              <span>NIST FIPS 180-4 SHA-256 Deduplication Across AICTE Cycles</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Guarantees that no applicant recycles building blueprints, fire NOC scans, or civil engineering completion certificates from other institutions or rejected historical applications.
            </p>
          </div>

          <div className={`p-5 rounded-xl border ${
            darkMode ? 'bg-slate-900 border-rose-900/50' : 'bg-white border-rose-200'
          } shadow-sm space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                <AlertOctagon className="h-4 w-4" />
                <span>EXACT BYTE-FOR-BYTE COLLISION DETECTED</span>
              </span>
              <span className="text-xs font-mono text-slate-500">Hash Match Algorithm: NIST SHA-256</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 font-mono text-xs break-all text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              SHA-256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-semibold text-slate-500">File In Current Application:</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Approved_Building_Plan_Salem_Corp.pdf (14.2 MB)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Uploaded by: Kaveri Institute of Technology (Case #AICTE-2026-D-33019)
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-semibold text-slate-500">Matched Historical Record:</div>
                <div className="font-bold text-rose-600 dark:text-rose-400 mt-1">
                  Sri_Balaji_Campus_Layout_Sanctioned_2024.pdf (14.2 MB)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Blacklisted Application: #AICTE-2024-REJECTED-09182 (Sri Balaji Institute)
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-800 dark:text-rose-200">
              <span className="font-bold">Investigation Finding: </span>
              The applicant submitted an architectural blueprint identical to a previously blacklisted institution, substituting only the title block on the cover page.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Error Level Analysis (ELA) Simulator */}
      {activeTab === 'elaDeepDive' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border text-xs ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Flame className="h-4 w-4 text-purple-500" />
              <span>Error Level Analysis (ELA) Compression Artifact Forensics</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Based on digital image forensic principles. ELA highlights intentional modifications by analyzing JPEG compression variance across different re-saving steps.
            </p>
          </div>

          <div className={`p-5 rounded-xl border space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-inherit pb-3 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Target: Fire_Safety_NOC_Apex_2026.pdf (Page 1 Date Block)
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-slate-500">ELA Threshold Sensitivity:</span>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={elaSensitivity} 
                  onChange={(e) => setElaSensitivity(Number(e.target.value))}
                  className="accent-purple-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-purple-600">{elaSensitivity}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Visual Appearance */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="font-semibold text-slate-500">Document Scan Visual View:</div>
                <div className="p-4 rounded bg-white dark:bg-slate-900 border text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                  <p className="text-center font-bold text-xs uppercase mb-2">Government of Uttar Pradesh - Fire Services</p>
                  <p>Certified that fire hydrants inspected at Apex Institute.</p>
                  <div className="mt-2 p-1.5 border border-dashed border-slate-400 rounded text-center font-bold">
                    Valid up to: 15-Mar-2027
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  To the naked eye, the stamp and text look normal.
                </p>
              </div>

              {/* Forensic ELA Thermal Heatmap */}
              <div className="p-4 rounded-xl border border-purple-900/60 text-xs space-y-2 bg-slate-950 text-purple-200">
                <div className="font-semibold text-purple-400 flex items-center justify-between">
                  <span>ELA Thermal Visualization ({elaSensitivity}% Gain):</span>
                  <span className="font-mono text-pink-400 font-bold">Anomaly Detected</span>
                </div>
                <div className="p-4 rounded bg-black border border-purple-800/80 font-mono leading-relaxed">
                  <p className="text-center text-slate-700 text-xs uppercase mb-2">Government of Uttar Pradesh - Fire Services</p>
                  <p className="text-slate-800">Certified that fire hydrants inspected at Apex Institute.</p>
                  <div className="mt-2 p-1.5 border-2 border-pink-500 bg-pink-950/90 rounded text-center font-bold text-pink-300 shadow-lg shadow-pink-500/50">
                    💥 HIGHER ERROR RATE: "2027" (+78.4% variance over background)
                  </div>
                </div>
                <p className="text-[11px] text-purple-300">
                  The date "2027" was inserted via an image editing tool and saved with a higher JPEG compression matrix than the 2020 background certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Metadata Inspector */}
      {activeTab === 'metadata' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border text-xs ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>Digital Chronology & Creation Pipeline Extraction</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Inspects underlying PDF trailers, XMP metadata streams, and font dictionary embeds.
            </p>
          </div>

          <div className={`p-5 rounded-xl border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-3 text-xs`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-inherit">
                <span className="text-slate-400">PDF Producer Engine:</span>
                <p className="font-mono font-bold text-rose-500 mt-1">Canva / Skia PDF Renderer</p>
                <p className="text-[10px] text-slate-500 mt-1">Suspicious: Official Govt certificates are generated via NIC / State Portal engines.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-inherit">
                <span className="text-slate-400">File Generation Timestamp:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">2026-10-17 23:14:02 IST</p>
                <p className="text-[10px] text-slate-500 mt-1">Created 2 hours before submission deadline.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-inherit">
                <span className="text-slate-400">Stated Notary Date:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">16-Mar-2020</p>
                <p className="text-[10px] text-slate-500 mt-1">Chronological gap of 6 years between physical stamp and PDF generation.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
