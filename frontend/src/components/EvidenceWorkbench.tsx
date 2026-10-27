import { useState } from 'react';
import type { 
  CaseApplication, 
  CaseDocument, 
  EvidenceNode, 
  ReviewerDecision,
  BoundingBox
} from '../types';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  ExternalLink, 
  Clock, 
  RotateCcw, 
  Sliders, 
  Flame, 
  Sparkles, 
  Hash, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  ArrowLeftRight,
  Send,
  Check,
  X,
  FileCheck2,
  FileSearch,
  Building,
  UserCheck
} from 'lucide-react';

interface EvidenceWorkbenchProps {
  currentCase: CaseApplication;
  onUpdateFindingDecision: (findingId: string, decision: ReviewerDecision, notes: string) => void;
  onAddAuditEntry: (action: string, details: string) => void;
  darkMode: boolean;
  onOpenDossier: (c: CaseApplication) => void;
}

export const EvidenceWorkbench: React.FC<EvidenceWorkbenchProps> = ({
  currentCase,
  onUpdateFindingDecision,
  onAddAuditEntry,
  darkMode,
  onOpenDossier,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(currentCase.documents[0]?.id || '');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFindingId, setSelectedFindingId] = useState<string>(currentCase.findings[0]?.id || '');
  const [forensicMode, setForensicMode] = useState<'normal' | 'ela' | 'bboxes'>('bboxes');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [overrideModalFinding, setOverrideModalFinding] = useState<EvidenceNode | null>(null);
  const [overrideNotes, setOverrideNotes] = useState<string>('');
  const [simulatedIssuerStatus, setSimulatedIssuerStatus] = useState<Record<string, string>>({});

  const activeDoc: CaseDocument = currentCase.documents.find(d => d.id === selectedDocId) || currentCase.documents[0];
  const activeFinding: EvidenceNode | undefined = currentCase.findings.find(f => f.id === selectedFindingId);

  // Jump to finding's document and page
  const handleSelectFinding = (finding: EvidenceNode) => {
    setSelectedFindingId(finding.id);
    setSelectedDocId(finding.docId);
    setCurrentPage(finding.page);
  };

  const handleDecision = (finding: EvidenceNode, decision: ReviewerDecision) => {
    if (decision === 'OVERRIDDEN') {
      setOverrideModalFinding(finding);
      setOverrideNotes('');
      return;
    }
    onUpdateFindingDecision(finding.id, decision, '');
    onAddAuditEntry(
      `DECISION_${decision}`,
      `Officer reviewed finding ${finding.id} (${finding.ruleName}). Status set to ${decision}.`
    );
  };

  const submitOverride = () => {
    if (overrideModalFinding) {
      onUpdateFindingDecision(overrideModalFinding.id, 'OVERRIDDEN', overrideNotes);
      onAddAuditEntry(
        'DECISION_OVERRIDDEN',
        `Official override applied to ${overrideModalFinding.id} (${overrideModalFinding.ruleName}). Rationale: "${overrideNotes || 'Manual inspection verified valid'}"`
      );
      setOverrideModalFinding(null);
      setOverrideNotes('');
    }
  };

  const toggleIssuerSimulation = (findingId: string) => {
    setSimulatedIssuerStatus(prev => {
      const current = prev[findingId] || 'original';
      let next = 'verified';
      if (current === 'original') next = 'verified';
      else if (current === 'verified') next = 'unavailable';
      else if (current === 'unavailable') next = 'tampered';
      else next = 'original';
      return { ...prev, [findingId]: next };
    });
  };

  // Find page content
  const pageData = activeDoc?.pagesContent?.find(p => p.page === currentPage) || activeDoc?.pagesContent?.[0];

  return (
    <div className="space-y-4">
      {/* Case Header & Quick Context */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-semibold">
              {currentCase.id}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              currentCase.riskTier === 'Critical Anomaly'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
            }`}>
              {currentCase.riskTier} (Score: {currentCase.currentRiskScore}/100)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Category: {currentCase.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {currentCase.instituteName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sponsoring Body: {currentCase.applicantSociety} • {currentCase.location}, {currentCase.state}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDossier(currentCase)}
            className="text-xs px-3 py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Export Scrutiny Dossier</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Document Bundle Navigator (3 Cols) */}
        <div className={`lg:col-span-3 rounded-xl border p-4 space-y-4 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <FileSearch className="h-4 w-4 text-blue-500" />
              <span>Document Bundle</span>
            </h3>
            <span className="text-xs text-slate-500">{currentCase.documents.length} files</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {currentCase.documents.map((doc) => {
              const isSelected = doc.id === activeDoc?.id;
              const hasAnomaly = currentCase.findings.some(f => f.docId === doc.id && (f.severity === 'critical'));

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setCurrentPage(1);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 ' + (darkMode ? 'bg-slate-800' : 'bg-blue-50/50')
                      : darkMode 
                        ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {doc.title}
                    </span>
                    {hasAnomaly && (
                      <span className="shrink-0 p-0.5 rounded bg-rose-500/10 text-rose-500" title="Anomaly flagged in this document">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{doc.pagesCount} pgs</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                    {doc.elaScore > 50 && (
                      <>
                        <span>•</span>
                        <span className="text-rose-500 font-bold">ELA {doc.elaScore}%</span>
                      </>
                    )}
                  </div>

                  {doc.duplicateDetected && (
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold border border-rose-500/20">
                      🚨 Duplicate Hash Collision
                    </div>
                  )}

                  {doc.metadataAlert && (
                    <div className="mt-1.5 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-300 font-medium border border-amber-500/20">
                      ⚠️ Canva / Photoshop Overlay
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Institutional Stats Summary */}
          <div className={`p-3 rounded-xl border text-xs space-y-2 ${
            darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Campus Norms Compliance
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Student Intake:</span>
                <p className="font-bold text-slate-900 dark:text-white">{currentCase.academicStats.intake} seats</p>
              </div>
              <div>
                <span className="text-slate-500">Faculty-Student:</span>
                <p className={`font-bold ${
                  currentCase.academicStats.ratio > currentCase.academicStats.requiredRatio
                    ? 'text-rose-500'
                    : 'text-emerald-500'
                }`}>
                  {currentCase.academicStats.ratio} (Req {currentCase.academicStats.requiredRatio})
                </p>
              </div>
              <div>
                <span className="text-slate-500">Land Claimed:</span>
                <p className="font-bold text-slate-900 dark:text-white">{currentCase.academicStats.landClaimedAcres} Acres</p>
              </div>
              <div>
                <span className="text-slate-500">Land Verified:</span>
                <p className={`font-bold ${
                  currentCase.academicStats.landVerifiedAcres < currentCase.academicStats.requiredLandAcres
                    ? 'text-rose-500'
                    : 'text-emerald-500'
                }`}>
                  {currentCase.academicStats.landVerifiedAcres} Acres
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: High-Fidelity Document Viewer (5 Cols) */}
        <div className={`lg:col-span-5 rounded-xl border p-4 space-y-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm flex flex-col`}>
          {/* Viewer Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-inherit pb-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                {activeDoc?.title}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">
                Pg {currentPage} of {activeDoc?.pagesCount}
              </span>
            </div>

            {/* Forensic Inspection Toggle */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setForensicMode('bboxes')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-all ${
                  forensicMode === 'bboxes'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Highlight extracted regions & bounding boxes"
              >
                Evidence
              </button>

              <button
                onClick={() => setForensicMode('ela')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-all flex items-center space-x-1 ${
                  forensicMode === 'ela'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-600 dark:text-purple-400 hover:text-purple-500'
                }`}
                title="Error Level Analysis: highlights digital image manipulation hot-spots"
              >
                <Flame className="h-3 w-3" />
                <span>ELA Heatmap</span>
              </button>

              <button
                onClick={() => setForensicMode('normal')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-all ${
                  forensicMode === 'normal'
                    ? 'bg-slate-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Plain
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 text-slate-500">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 10))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Page Canvas */}
          <div className={`relative min-h-[480px] p-6 rounded-lg border overflow-hidden transition-all select-none ${
            forensicMode === 'ela'
              ? 'bg-slate-950 border-purple-900/60 font-mono text-purple-300'
              : darkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-200' 
                : 'bg-amber-50/20 border-slate-300 text-slate-900 shadow-inner'
          }`} style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>

            {/* Simulated Watermark & Stamp */}
            <div className="absolute right-4 top-4 border-2 border-indigo-500/20 rounded-full h-16 w-16 flex items-center justify-center rotate-12 pointer-events-none">
              <span className="text-[8px] font-bold text-indigo-500/40 text-center uppercase">
                AICTE Official<br/>Scrutiny Copy
              </span>
            </div>

            {/* ELA Thermal Forensics Simulation Overlay Banner */}
            {forensicMode === 'ela' && (
              <div className="mb-4 p-2.5 rounded bg-purple-950/80 border border-purple-800 text-[11px] text-purple-200 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>ELA Forensics Active: High frequency compression gradients glow in Magenta.</span>
                </span>
                <span className="font-mono text-xs font-bold text-pink-400">
                  Peak Variance: +78.4%
                </span>
              </div>
            )}

            {/* Document Header Text */}
            <div className="border-b pb-3 mb-4 border-inherit">
              <div className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
                {activeDoc?.category} • Page {currentPage}
              </div>
              <h4 className="text-sm font-bold mt-0.5">
                {pageData?.title || activeDoc?.title}
              </h4>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                SHA-256: {activeDoc?.sha256.slice(0, 24)}...
              </div>
            </div>

            {/* Document Text Lines with Interactive Bounding Boxes */}
            <div className="space-y-2.5 text-xs leading-relaxed">
              {pageData?.lines.map((line, idx) => {
                const isTamperedLine = line.includes('OVERLAY DETECTED') || line.includes('Tampered') || line.includes('Dispute') || line.includes('COLLISION');
                const isHighlightLine = line.includes('TOTAL CONVEYED LAND AREA') || line.includes('TOTAL FIRST YEAR SANCTIONED') || line.includes('Total Verified Active');

                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded transition-all relative ${
                      forensicMode === 'ela' && isTamperedLine
                        ? 'bg-fuchsia-950/90 text-pink-300 ring-2 ring-pink-500 shadow-lg shadow-pink-500/30 font-bold'
                        : forensicMode === 'bboxes' && isHighlightLine
                        ? 'bg-blue-500/10 border-l-4 border-blue-500 text-blue-900 dark:text-blue-200 pl-2'
                        : 'hover:bg-slate-100/50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Render Visual Bounding Box Anchors */}
            {forensicMode === 'bboxes' && pageData?.bboxes?.map((box, bIdx) => {
              const isBoxActive = activeFinding?.page === currentPage;
              return (
                <div
                  key={bIdx}
                  className={`mt-4 p-2 rounded-lg border-2 text-[11px] font-medium flex items-center justify-between ${
                    box.type === 'tampered'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                      : box.type === 'mismatch'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                    <span>Evidence Anchor: {box.label}</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-current/10 px-1.5 py-0.5 rounded">
                    {box.type}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Page Navigator Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-inherit text-xs">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2.5 py-1 rounded border disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Previous Page
            </button>
            <span className="text-slate-500">
              Page {currentPage} of {activeDoc?.pagesCount}
            </span>
            <button
              disabled={currentPage >= (activeDoc?.pagesCount || 1)}
              onClick={() => setCurrentPage(prev => Math.min(activeDoc?.pagesCount || 1, prev + 1))}
              className="px-2.5 py-1 rounded border disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Next Page
            </button>
          </div>
        </div>

        {/* Right Column: Three-Signal Verification & Decisioning (4 Cols) */}
        <div className={`lg:col-span-4 rounded-xl border p-4 space-y-4 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Sliders className="h-4 w-4 text-indigo-500" />
                <span>EvidenceGraph & Three-Signal</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/10 text-indigo-500 font-semibold">
                {currentCase.findings.length} findings
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strictly decoupled verification signals per regulatory standards
            </p>
          </div>

          {/* Finding Selector Pills */}
          <div className="space-y-1.5">
            {currentCase.findings.map((f) => {
              const isSelected = f.id === activeFinding?.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleSelectFinding(f)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 ' + (darkMode ? 'bg-slate-800' : 'bg-indigo-50/50')
                      : darkMode 
                        ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {f.ruleName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {f.ruleId} • Pg {f.page}
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                    f.reviewerDecision === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : f.reviewerDecision === 'FLAGGED'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      : f.reviewerDecision === 'OVERRIDDEN'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}>
                    {f.reviewerDecision}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Finding Detail Card */}
          {activeFinding && (
            <div className={`p-4 rounded-xl border space-y-3 ${
              darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <div className="border-b border-inherit pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {activeFinding.ruleId}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {activeFinding.ruleVersion}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeFinding.ruleName}
                </h4>
              </div>

              {/* Side-by-Side Values */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-inherit">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Claimed in Form:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeFinding.claimedValue}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Extracted from Source:</span>
                  <p className={`font-bold mt-0.5 ${
                    activeFinding.status === 'mismatch' || activeFinding.status === 'anomaly'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {activeFinding.extractedValue}
                  </p>
                </div>
              </div>

              {/* THE THREE SIGNALS (Kept Separate) */}
              <div className="space-y-2 text-xs">
                {/* Signal 1 */}
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                      <span>Signal 1: Extraction Quality</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {activeFinding.signal1Score}% OCR Confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Characters extracted with vector coordinate accuracy. No OCR degradation detected.
                  </p>
                </div>

                {/* Signal 2 */}
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Signal 2: Consistency Engine
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      activeFinding.status === 'mismatch' || activeFinding.status === 'anomaly'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}>
                      {activeFinding.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    {activeFinding.signal2Result}
                  </p>
                </div>

                {/* Signal 3 */}
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Signal 3: Authoritative Issuer Gateway
                    </span>
                    <button
                      onClick={() => toggleIssuerSimulation(activeFinding.id)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 underline hover:text-blue-500"
                      title="Click to toggle simulated issuer gateway responses"
                    >
                      [Simulate Mock]
                    </button>
                  </div>
                  <div className="mt-1 flex items-center space-x-1.5">
                    <span className={`h-2 w-2 rounded-full ${
                      activeFinding.status === 'anomaly'
                        ? 'bg-rose-500'
                        : activeFinding.status === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`} />
                    <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                      {activeFinding.authoritativeValue || 'Verified by National Database'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeFinding.signal3Result}
                  </p>
                </div>
              </div>

              {/* Reviewer Action Recommendation */}
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                <div className="font-semibold flex items-center space-x-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Recommended Action:</span>
                </div>
                <p className="mt-0.5 text-[11px]">
                  {activeFinding.recommendedAction}
                </p>
              </div>

              {/* Official Reviewer Decision Buttons */}
              <div className="pt-2 border-t border-inherit space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Official Reviewer Decision
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleDecision(activeFinding, 'ACCEPTED')}
                    className={`p-2 rounded-lg font-medium flex items-center justify-center space-x-1 transition-all ${
                      activeFinding.reviewerDecision === 'ACCEPTED'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Accept Value</span>
                  </button>

                  <button
                    onClick={() => handleDecision(activeFinding, 'FLAGGED')}
                    className={`p-2 rounded-lg font-medium flex items-center justify-center space-x-1 transition-all ${
                      activeFinding.reviewerDecision === 'FLAGGED'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Flag Anomaly</span>
                  </button>

                  <button
                    onClick={() => handleDecision(activeFinding, 'CLARIFICATION_REQUESTED')}
                    className={`p-2 rounded-lg font-medium flex items-center justify-center space-x-1 transition-all ${
                      activeFinding.reviewerDecision === 'CLARIFICATION_REQUESTED'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Seek Clarification</span>
                  </button>

                  <button
                    onClick={() => handleDecision(activeFinding, 'OVERRIDDEN')}
                    className={`p-2 rounded-lg font-medium flex items-center justify-center space-x-1 transition-all ${
                      activeFinding.reviewerDecision === 'OVERRIDDEN'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border border-purple-500/30'
                    }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Override with Note</span>
                  </button>
                </div>

                {activeFinding.reviewerNotes && (
                  <div className="mt-2 p-2 rounded bg-purple-500/10 text-purple-800 dark:text-purple-300 text-[11px] border border-purple-500/20">
                    <span className="font-bold">Override Justification: </span>
                    {activeFinding.reviewerNotes}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Override Modal */}
      {overrideModalFinding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-purple-500" />
                <span>Official Decision Override</span>
              </h3>
              <button 
                onClick={() => setOverrideModalFinding(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are applying an official override to rule finding <strong>{overrideModalFinding.ruleName}</strong>. AICTE regulatory standards mandate an immutable rationale in the append-only audit ledger.
            </p>

            <div>
              <label className="text-xs font-semibold block mb-1">
                Official Justification / Exception Rationale:
              </label>
              <textarea
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
                placeholder="E.g., Competent Authority provisional renewal receipt inspected and verified on page 4..."
                className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setOverrideModalFinding(null)}
                className="px-3 py-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={submitOverride}
                className="px-4 py-1.5 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white"
              >
                Confirm & Log Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
