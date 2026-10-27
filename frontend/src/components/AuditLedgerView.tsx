import React from 'react';
import { 
  History, 
  ShieldCheck, 
  Hash, 
  Clock, 
  User, 
  FileCheck2, 
  Lock, 
  ArrowDown
} from 'lucide-react';
import type { CaseApplication } from '../types';

interface AuditLedgerViewProps {
  activeCase: CaseApplication;
  darkMode: boolean;
  onOpenDossier: (c: CaseApplication) => void;
}

export const AuditLedgerView: React.FC<AuditLedgerViewProps> = ({
  activeCase,
  darkMode,
  onOpenDossier,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-600 text-white shadow-md shadow-amber-500/20">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Cryptographic Append-Only Audit Trail
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Every scrutiny flag, reviewer decision, exception override, and rule evaluation is sealed into a SHA-256 chained ledger. Past verdicts remain 100% auditable for CVC (Central Vigilance Commission) and judicial review.
            </p>
          </div>

          <button
            onClick={() => onOpenDossier(activeCase)}
            className="text-xs px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-sm transition-all"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Generate Official Scrutiny Dossier</span>
          </button>
        </div>
      </div>

      {/* Case Context Pill */}
      <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-500">Active Audit Ledger for:</span>
          <span className="font-bold text-slate-900 dark:text-white">{activeCase.instituteName}</span>
          <span className="font-mono text-blue-600 dark:text-blue-400">({activeCase.id})</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          Chained Blocks: {activeCase.auditLog.length}
        </span>
      </div>

      {/* Hash Chained Blocks */}
      <div className="space-y-4">
        {activeCase.auditLog.map((block, idx) => {
          return (
            <div key={block.id} className="relative">
              {idx > 0 && (
                <div className="flex justify-center -my-2.5 relative z-10">
                  <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700">
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </div>
              )}

              <div className={`p-5 rounded-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              } shadow-sm space-y-3`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-inherit pb-2.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      BLOCK #{block.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {block.action}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(block.timestamp).toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{block.officerName}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {block.details}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-inherit font-mono text-[10px]">
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 truncate">
                    <span className="text-slate-400">PREV_HASH: </span>
                    {block.prevHash}
                  </div>
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 truncate font-bold">
                    <span className="text-slate-400">BLOCK_HASH: </span>
                    {block.blockHash}
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
