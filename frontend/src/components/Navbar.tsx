import React from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  History, 
  UserCheck, 
  Search, 
  FileCheck, 
  AlertTriangle,
  Fingerprint,
  Sliders,
  Send,
  Layers
} from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ruleVersion: string;
  setRuleVersion: (ver: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeRole,
  setActiveRole,
  activeTab,
  setActiveTab,
  ruleVersion,
  setRuleVersion,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className={`border-b transition-colors duration-200 sticky top-0 z-50 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top tier brand and meta */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-inherit">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                DocuSure AI
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Regulatory Bureau
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                v2.4 Enterprise MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              AICTE Regulation Bureau • Evidence-First Application Scrutiny Workbench
            </p>
          </div>
        </div>

        {/* Global Controls: Time-Travel Rule Replay, Role Switcher, Dark Mode */}
        <div className="flex items-center space-x-3">
          {/* Regulatory Version Selector */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <History className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Rule Cycle:</span>
            <select
              value={ruleVersion}
              onChange={(e) => setRuleVersion(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              title="Regulatory Version Replay: Back-test against historical AICTE handbooks"
            >
              <option value="APH 2024-27 v2.3.1 (Active)">APH 2024-27 v2.3.1 (Current)</option>
              <option value="APH 2023-24 v1.9 (Archived)">APH 2023-24 v1.9 (Historical Replay)</option>
              <option value="APH 2020-23 v3.0 (Legacy)">APH 2020-23 v3.0 (Legacy Audit)</option>
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as UserRole)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Scrutiny Officer">Scrutiny Officer (Level 1)</option>
              <option value="Committee Chairman">SSC Chairman (Level 2)</option>
              <option value="Applicant / College Admin">Applicant (Pre-Flight Mode)</option>
              <option value="Vigilance Auditor">Vigilance Auditor (Ledger)</option>
            </select>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode((prev: boolean) => !prev)}
            className={`p-2 rounded-lg transition-colors border ${
              darkMode 
                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 border-slate-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'queue'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Scrutiny Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('workbench')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'workbench'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Evidence Workbench</span>
          </button>

          <button
            onClick={() => setActiveTab('forensics')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'forensics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Fingerprint className="h-4 w-4 text-purple-400" />
            <span>Forensics & Integrity Lab</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
              Vigilance
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'rules'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>APH Rule Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('preflight')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'preflight'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Send className="h-4 w-4 text-emerald-500" />
            <span>Applicant Pre-Flight</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              Sandbox
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="h-4 w-4 text-amber-500" />
            <span>Audit Ledger</span>
          </button>
        </nav>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Application or Institute..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-all ${
              darkMode 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-800' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
        </div>
      </div>
    </header>
  );
};
