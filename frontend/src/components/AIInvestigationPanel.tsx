import React from 'react';
import { Bot, CheckCircle, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { Incident } from '../types';
import { SeverityBadge } from './IncidentBadge';

interface AIInvestigationPanelProps {
  incident: Incident;
  onStartInvestigation: () => void;
  isInvestigating: boolean;
  onOpenApproval: () => void;
}

export const AIInvestigationPanel: React.FC<AIInvestigationPanelProps> = ({
  incident,
  onStartInvestigation,
  isInvestigating,
  onOpenApproval
}) => {
  const hasRCA = !!incident.root_cause;
  const confidencePct = hasRCA ? Math.round(incident.root_cause!.confidence * 100) : 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Subtle Glow background */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Agent Investigation</h2>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono px-2 py-0.5 rounded font-semibold">
                LangGraph State Machine
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-agent evidence correlation & root cause inference engine</p>
          </div>
        </div>

        <div>
          {!hasRCA && !isInvestigating && (
            <button
              onClick={onStartInvestigation}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start AI Investigation</span>
            </button>
          )}

          {isInvestigating && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs animate-pulse">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Agent Graph Executing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Investigation Steps Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${incident.evidence.length > 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center justify-between font-semibold">
            <span>1. Monitoring Agent</span>
            {incident.evidence.length > 0 ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
          </div>
          <p className="text-[11px] opacity-80">CloudWatch metrics & logs</p>
        </div>

        <div className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${hasRCA ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center justify-between font-semibold">
            <span>2. RCA Agent</span>
            {hasRCA ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
          </div>
          <p className="text-[11px] opacity-80">Anomaly causality correlation</p>
        </div>

        <div className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${incident.recommendation ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center justify-between font-semibold">
            <span>3. Remediation Agent</span>
            {incident.recommendation ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
          </div>
          <p className="text-[11px] opacity-80">Safe remediation formulation</p>
        </div>

        <div className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${incident.recovery_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
          <div className="flex items-center justify-between font-semibold">
            <span>4. Human Approval Gate</span>
            {incident.remediation_approved ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
          </div>
          <p className="text-[11px] opacity-80">{incident.remediation_approved ? 'Approved & Executed' : 'Awaiting Approval'}</p>
        </div>
      </div>

      {/* Root Cause & Confidence Results */}
      {hasRCA && (
        <div className="space-y-6 pt-2">
          {/* Main RCA Card */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Probable Root Cause</span>
                <h3 className="text-base font-bold text-white mt-0.5">{incident.root_cause!.primary_factor}</h3>
              </div>

              {/* Confidence Gauge Pill */}
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Confidence Level</div>
                  <div className="text-lg font-extrabold text-sky-400 font-mono">{confidencePct}%</div>
                </div>
                <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-sky-400 flex items-center justify-center font-bold text-xs text-sky-400 font-mono">
                  {confidencePct}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              {incident.root_cause!.description}
            </p>

            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Reasoning Summary: </span>
              {incident.root_cause!.reasoning_summary}
            </div>
          </div>

          {/* Evidence List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Correlated Evidence Artifacts ({incident.evidence.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incident.evidence.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-1.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{item.name}</span>
                    <SeverityBadge severity={item.severity} />
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{item.observation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation Box */}
          {incident.recommendation && (
            <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-950 border border-sky-500/30 p-5 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">Recommended Safe Action</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                      Risk: {incident.recommendation.risk}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white capitalize mt-1">
                    Action: {incident.recommendation.action.replace('_', ' ')}
                  </h4>
                </div>

                {!incident.remediation_approved ? (
                  <button
                    onClick={onOpenApproval}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve Remediation</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
                    <CheckCircle className="w-4 h-4" />
                    <span>Remediation Approved & Verified</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{incident.recommendation.reason}</p>
              
              <div className="text-xs text-sky-300 bg-sky-500/10 p-2.5 rounded-lg border border-sky-500/20 font-mono">
                <strong>Expected Outcome: </strong>{incident.recommendation.expected_result}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
