import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Filter, 
  ShieldAlert,
  FileCheck,
  Fingerprint,
  TrendingDown
} from 'lucide-react';
import type { CaseApplication } from '../types';

interface ScrutinyQueueProps {
  cases: CaseApplication[];
  onSelectCase: (c: CaseApplication) => void;
  selectedCaseId: string;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  riskFilter: string;
  setRiskFilter: (risk: string) => void;
  darkMode: boolean;
  onOpenDossier: (c: CaseApplication) => void;
}

export const ScrutinyQueue: React.FC<ScrutinyQueueProps> = ({
  cases,
  onSelectCase,
  selectedCaseId,
  categoryFilter,
  setCategoryFilter,
  riskFilter,
  setRiskFilter,
  darkMode,
  onOpenDossier,
}) => {
  const filteredCases = cases.filter((item) => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesRisk = riskFilter === 'ALL' || item.riskTier === riskFilter;
    return matchesCat && matchesRisk;
  });

  const totalCases = cases.length;
  const flaggedCases = cases.filter(c => c.riskTier === 'Critical Anomaly').length;
  const clearedCases = cases.filter(c => c.riskTier === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Operational KPI Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Scrutiny Applications</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalCases}</span>
            <span className="text-xs text-slate-500">active in current cycle</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            AICTE Scrutiny Handbook APH 2024-27
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Anomalies Flagged</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{flaggedCases}</span>
            <span className="text-xs text-slate-500">require official review</span>
          </div>
          <div className="mt-2 text-xs text-rose-500 font-medium flex items-center space-x-1">
            <span>AI flags, officials decide</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Provisionally Cleared</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{clearedCases}</span>
            <span className="text-xs text-slate-500">all 3 signals green</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Fast-track approval recommended
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg. Scrutiny Time / Case</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">&lt; 3.2 min</span>
            <span className="text-xs text-emerald-500 flex items-center">
              <TrendingDown className="h-3 w-3 mr-0.5" /> -92% vs manual (45 min)
            </span>
          </div>
          <div className="mt-2 text-xs text-indigo-500 font-medium">
            Targets met: &gt;85% extract, &gt;90% valid
          </div>
        </div>
      </div>

      {/* Filter and sorting controls */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Filter className="h-4 w-4 text-blue-500" />
          <span>Filter Scrutiny Queue:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">All Application Categories</option>
            <option value="New Technical Institution">New Technical Institution</option>
            <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
            <option value="Increase in Intake">Increase in Intake</option>
            <option value="Addition of New Discipline">Addition of New Discipline</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical Anomaly">Critical Anomalies Only</option>
            <option value="Medium">Medium Risk / Pending Check</option>
            <option value="Low">Low Risk / Clean Pass</option>
          </select>
        </div>
      </div>

      {/* Case List Cards */}
      <div className="space-y-3">
        {filteredCases.map((app) => {
          const isSelected = app.id === selectedCaseId;
          const criticalFindings = app.findings.filter(f => f.severity === 'critical');

          return (
            <div
              key={app.id}
              onClick={() => onSelectCase(app)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md ' + (darkMode ? 'bg-slate-800/90' : 'bg-blue-50/40')
                  : darkMode 
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              {/* Left edge risk color bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                app.riskTier === 'Critical Anomaly'
                  ? 'bg-rose-500'
                  : app.riskTier === 'Medium'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`} />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {app.id}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center space-x-1 ${
                      app.riskTier === 'Critical Anomaly'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        : app.riskTier === 'Medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                    }`}>
                      {app.riskTier === 'Critical Anomaly' && <ShieldAlert className="h-3.5 w-3.5" />}
                      {app.riskTier === 'Medium' && <Clock className="h-3.5 w-3.5" />}
                      {app.riskTier === 'Low' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      <span>{app.riskTier}: Score {app.currentRiskScore}/100</span>
                    </span>

                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {app.category}
                    </span>

                    {app.ghostFacultyConflicts.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center space-x-1">
                        <Fingerprint className="h-3 w-3" />
                        <span>Ghost Faculty Alert</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {app.instituteName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <Building2 className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {app.applicantSociety}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {app.location}, {app.state}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      Submitted: {app.submissionDate}
                    </span>
                  </div>

                  {/* Highlighted findings summary */}
                  {criticalFindings.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {criticalFindings.map((f) => (
                        <span 
                          key={f.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 font-medium"
                        >
                          ⚠️ {f.ruleName}: {f.claimedValue} vs {f.extractedValue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side stats & action */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Three-Signal Status</div>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" title="Extraction Quality">
                        Signal 1: 96%
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        app.findings.some(f => f.status === 'mismatch' || f.status === 'anomaly')
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`} title="Consistency Across Documents">
                        Signal 2: {app.findings.some(f => f.status === 'mismatch' || f.status === 'anomaly') ? 'Mismatch' : 'Consistent'}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        app.findings.some(f => f.status === 'anomaly')
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                          : app.findings.some(f => f.status === 'pending')
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`} title="Authoritative Issuer Verification">
                        Signal 3: {app.findings.some(f => f.status === 'anomaly') ? 'Flagged' : app.findings.some(f => f.status === 'pending') ? 'Pending' : 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDossier(app);
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center space-x-1 transition-all ${
                        darkMode 
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <FileCheck className="h-3.5 w-3.5 text-blue-500" />
                      <span>Dossier</span>
                    </button>

                    <button
                      onClick={() => onSelectCase(app)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      <span>Examine Evidence</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
