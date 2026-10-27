import React, { useState, useEffect } from 'react';
import { MOCK_CASES } from './data/mockCases';
import type { CaseApplication, ReviewerDecision, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { ScrutinyQueue } from './components/ScrutinyQueue';
import { EvidenceWorkbench } from './components/EvidenceWorkbench';
import { ForensicLab } from './components/ForensicLab';
import { RuleEngineView } from './components/RuleEngineView';
import { ApplicantPreFlightPortal } from './components/ApplicantPreFlightPortal';
import { AuditLedgerView } from './components/AuditLedgerView';
import { DossierModal } from './components/DossierModal';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeRole, setActiveRole] = useState<UserRole>('Scrutiny Officer');
  const [activeTab, setActiveTab] = useState<string>('queue');
  const [ruleVersion, setRuleVersion] = useState<string>('APH 2024-27 v2.3.1 (Active)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const [cases, setCases] = useState<CaseApplication[]>(MOCK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(MOCK_CASES[0].id);
  const [dossierModalCase, setDossierModalCase] = useState<CaseApplication | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // When active role changes to Applicant, automatically switch to Pre-Flight portal!
  useEffect(() => {
    if (activeRole === 'Applicant / College Admin') {
      setActiveTab('preflight');
    } else if (activeRole === 'Vigilance Auditor') {
      setActiveTab('audit');
    }
  }, [activeRole]);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Update a finding's reviewer decision
  const handleUpdateFindingDecision = (findingId: string, decision: ReviewerDecision, notes: string) => {
    setCases(prevCases => {
      return prevCases.map(c => {
        if (c.id !== selectedCaseId) return c;
        const updatedFindings = c.findings.map(f => {
          if (f.id !== findingId) return f;
          return {
            ...f,
            reviewerDecision: decision,
            reviewerNotes: notes || f.reviewerNotes,
          };
        });

        // Recalculate risk score dynamically
        const unresolvedCritical = updatedFindings.filter(f => f.severity === 'critical' && f.reviewerDecision === 'PENDING').length;
        const newScore = unresolvedCritical === 0 ? 12 : c.currentRiskScore;
        const newTier = unresolvedCritical === 0 ? 'Low' : c.riskTier;
        const newStatus = unresolvedCritical === 0 ? 'Provisionally Cleared' : c.overallStatus;

        return {
          ...c,
          findings: updatedFindings,
          currentRiskScore: newScore,
          riskTier: newTier,
          overallStatus: newStatus,
        };
      });
    });
  };

  // Add an entry to the case's append-only audit trail
  const handleAddAuditEntry = (action: string, details: string) => {
    const newBlockId = `AUD-${Date.now().toString().slice(-4)}`;
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const lastBlock = selectedCase.auditLog[selectedCase.auditLog.length - 1];
    const prevHash = lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const newBlock = {
      id: newBlockId,
      timestamp: new Date().toISOString(),
      officerName: activeRole === 'Scrutiny Officer' ? 'Dr. S. K. Narayanan' : activeRole,
      officerRole: activeRole,
      action,
      details,
      ruleVersion,
      prevHash,
      blockHash: `${randomHex}7c9f8a61b2e4d5c9e0f1a2b3c4d5e6f7`,
    };

    setCases(prevCases => {
      return prevCases.map(c => {
        if (c.id !== selectedCaseId) return c;
        return {
          ...c,
          auditLog: [...c.auditLog, newBlock],
        };
      });
    });
  };

  const handleSelectCase = (c: CaseApplication) => {
    setSelectedCaseId(c.id);
    setActiveTab('workbench');
  };

  // Filter cases with search query
  const searchedCases = cases.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.instituteName.toLowerCase().includes(q) ||
      c.applicantSociety.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ruleVersion={ruleVersion}
        setRuleVersion={setRuleVersion}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'queue' && (
          <ScrutinyQueue
            cases={searchedCases}
            onSelectCase={handleSelectCase}
            selectedCaseId={selectedCaseId}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
            darkMode={darkMode}
            onOpenDossier={(c) => setDossierModalCase(c)}
          />
        )}

        {activeTab === 'workbench' && (
          <EvidenceWorkbench
            currentCase={selectedCase}
            onUpdateFindingDecision={handleUpdateFindingDecision}
            onAddAuditEntry={handleAddAuditEntry}
            darkMode={darkMode}
            onOpenDossier={(c) => setDossierModalCase(c)}
          />
        )}

        {activeTab === 'forensics' && (
          <ForensicLab
            cases={cases}
            activeCase={selectedCase}
            darkMode={darkMode}
            onOpenDossier={(c) => setDossierModalCase(c)}
          />
        )}

        {activeTab === 'rules' && (
          <RuleEngineView
            darkMode={darkMode}
            ruleVersion={ruleVersion}
            setRuleVersion={setRuleVersion}
          />
        )}

        {activeTab === 'preflight' && (
          <ApplicantPreFlightPortal
            darkMode={darkMode}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLedgerView
            activeCase={selectedCase}
            darkMode={darkMode}
            onOpenDossier={(c) => setDossierModalCase(c)}
          />
        )}
      </main>

      {/* Exportable Dossier Modal */}
      {dossierModalCase && (
        <DossierModal
          application={dossierModalCase}
          onClose={() => setDossierModalCase(null)}
          darkMode={darkMode}
        />
      )}

      {/* Persistent Footer */}
      <footer className={`border-t py-4 text-xs text-center border-inherit ${
        darkMode ? 'bg-slate-900/60 text-slate-500' : 'bg-white text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>DocuSure AI</strong> — Enterprise Regulatory Scrutiny & Document Authentication Workbench
          </div>
          <div className="flex items-center space-x-3">
            <span>AICTE Approval Process Handbook 2024-27</span>
            <span>•</span>
            <span>Three-Signal Evidence Architecture</span>
            <span>•</span>
            <span className="text-emerald-500 font-medium">Deterministic Rule Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
