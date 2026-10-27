import React, { useState } from 'react';
import { 
  Sliders, 
  BookOpen, 
  Calculator, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  GraduationCap,
  Scale
} from 'lucide-react';

interface RuleEngineViewProps {
  darkMode: boolean;
  ruleVersion: string;
  setRuleVersion: (ver: string) => void;
}

export const RuleEngineView: React.FC<RuleEngineViewProps> = ({
  darkMode,
  ruleVersion,
  setRuleVersion,
}) => {
  // Calculator state
  const [level, setLevel] = useState<'UG_ENGG' | 'PG_ENGG' | 'DIPLOMA' | 'MANAGEMENT'>('UG_ENGG');
  const [intake, setIntake] = useState<number>(360);
  const [locationType, setLocationType] = useState<'METRO' | 'URBAN' | 'RURAL'>('URBAN');

  // AICTE Norm Calculations
  const getFSRRatio = () => {
    switch (level) {
      case 'UG_ENGG': return 20; // 1:20
      case 'PG_ENGG': return 12; // 1:12
      case 'DIPLOMA': return 25; // 1:25
      case 'MANAGEMENT': return 20; // 1:20
    }
  };

  const requiredFaculty = Math.ceil(intake / getFSRRatio());
  const professors = Math.max(1, Math.floor(requiredFaculty * 0.166)); // 1 per 6
  const assocProfessors = Math.floor(requiredFaculty * 0.333); // 2 per 6
  const asstProfessors = Math.max(0, requiredFaculty - professors - assocProfessors);

  const getLandRequirement = () => {
    if (level === 'DIPLOMA') {
      return locationType === 'METRO' ? 1.5 : locationType === 'URBAN' ? 2.5 : 4.0;
    }
    return locationType === 'METRO' ? 2.5 : locationType === 'URBAN' ? 4.0 : 7.5;
  };

  const getBuiltUpArea = () => {
    // 35 Sq.m per student
    return intake * 35;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Sliders className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                AICTE Approval Process Handbook (APH) Rule Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Deterministic, versioned rules codified in declarative schemas. No hardcoded logic in application code ensures reproducible scrutiny across academic cycles and court appeals.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-inherit">
            <History className="h-4 w-4 text-indigo-500" />
            <span className="text-slate-500">Active Rule Set:</span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{ruleVersion}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Norms & Ratio Calculator (7 Cols) */}
        <div className={`lg:col-span-7 rounded-2xl border p-5 space-y-5 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-emerald-500" />
              <span>Interactive APH Norms & Faculty-Student Calculator</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              Formula: N = Intake / FSR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Level Selector */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Programme Level:
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className={`w-full p-2 rounded-lg border font-medium focus:ring-1 focus:ring-blue-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="UG_ENGG">Undergraduate (B.Tech / B.E.)</option>
                <option value="PG_ENGG">Postgraduate (M.Tech)</option>
                <option value="DIPLOMA">Polytechnic / Diploma</option>
                <option value="MANAGEMENT">Management (MBA / PGDM)</option>
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Campus Location Category:
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className={`w-full p-2 rounded-lg border font-medium focus:ring-1 focus:ring-blue-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="METRO">Mega / Metro City</option>
                <option value="URBAN">Urban / State Capital</option>
                <option value="RURAL">Rural / Other Areas</option>
              </select>
            </div>

            {/* Sanctioned Intake Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span>Sanctioned Intake:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{intake}</span>
              </div>
              <input 
                type="range"
                min="60"
                max="720"
                step="60"
                value={intake}
                onChange={(e) => setIntake(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>60</span>
                <span>360</span>
                <span>720</span>
              </div>
            </div>
          </div>

          {/* Computed Regulatory Outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Faculty Output */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-blue-50/50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Required Faculty</span>
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {requiredFaculty} <span className="text-xs font-normal text-slate-500">(1:{getFSRRatio()})</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 border-t border-inherit pt-2">
                <div>• Professors: <strong>{professors}</strong> (1:6)</div>
                <div>• Assoc. Professors: <strong>{assocProfessors}</strong> (2:6)</div>
                <div>• Asst. Professors: <strong>{asstProfessors}</strong> (3:6)</div>
              </div>
            </div>

            {/* Land Area Output */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-emerald-50/50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Contiguous Land</span>
                <Scale className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {getLandRequirement()} <span className="text-xs font-normal text-slate-500">Acres</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 border-t border-inherit pt-2">
                <div>Metric: <strong>{(getLandRequirement() * 4046.86).toLocaleString()} Sq.M</strong></div>
                <div className="text-[10px] text-slate-400 mt-1">Single continuous land parcel required per APH Clause 4.1</div>
              </div>
            </div>

            {/* Built-up Area Output */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-purple-50/50 border-purple-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Built-up Floor Area</span>
                <Building className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {getBuiltUpArea().toLocaleString()} <span className="text-xs font-normal text-slate-500">Sq.M</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 border-t border-inherit pt-2">
                <div>Instructional: <strong>{(getBuiltUpArea() * 0.55).toFixed(0)} Sq.M</strong></div>
                <div className="text-[10px] text-slate-400 mt-1">Includes labs, classrooms, library, and faculty cubicles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Declarative YAML Rulebook Viewer (5 Cols) */}
        <div className={`lg:col-span-5 rounded-2xl border p-5 space-y-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <div className="flex items-center justify-between border-b border-inherit pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Declarative Rule Definition (YAML)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">version: 2.3.1</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-[420px] overflow-y-auto border border-slate-800">
            <span className="text-purple-400">rule_version:</span> <span className="text-emerald-400">"APH-2024-27-v2.3.1"</span><br/>
            <span className="text-purple-400">effective_date_start:</span> <span className="text-emerald-400">"2024-04-01"</span><br/>
            <span className="text-purple-400">effective_date_end:</span> <span className="text-emerald-400">"2027-03-31"</span><br/>
            <span className="text-purple-400">regulations:</span><br/>
            &nbsp;&nbsp;<span className="text-blue-400">- id:</span> <span className="text-emerald-400">"AICTE-APH-2024-27-R4.1-LAND"</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">title:</span> "Contiguous Land Area Requirement"<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">metro_acres:</span> 2.5<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">urban_acres:</span> 4.0<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">rural_acres:</span> 7.5<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">grace_period_days:</span> 0<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">verification_signal:</span> "MahaBhulekh / Bhoomi API"<br/>
            <br/>
            &nbsp;&nbsp;<span className="text-blue-400">- id:</span> <span className="text-emerald-400">"AICTE-APH-2024-27-R4.2-FSR"</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">title:</span> "Faculty to Student Ratio Norm"<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">ug_ratio:</span> "1:20"<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">pg_ratio:</span> "1:12"<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">cadre_ratio:</span> "1:2:6"<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">epfo_verification_mandatory:</span> true<br/>
            <br/>
            &nbsp;&nbsp;<span className="text-blue-400">- id:</span> <span className="text-emerald-400">"AICTE-APH-2024-27-R3.4-FIRE"</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">title:</span> "Fire Safety Clearance NOC"<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">max_age_years:</span> 3<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">ela_tamper_threshold:</span> 0.65<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400">issuer_fallback:</span> "PENDING_MANUAL_REVIEW"<br/>
          </div>

          <p className="text-[11px] text-slate-500">
            Rules can be updated by regulatory officers via configuration without recompiling or redeploying code.
          </p>
        </div>
      </div>
    </div>
  );
};
