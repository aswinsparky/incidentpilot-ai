import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { IncidentReport } from '../types';
import { fetchReports, fetchReport } from '../services/api';

export const ReportsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (id) {
        const rep = await fetchReport(id);
        setSelectedReport(rep);
      }
      const list = await fetchReports();
      setReports(list);
      setLoading(false);
    };
    load();
  }, [id]);

  if (selectedReport) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() => {
              setSelectedReport(null);
              navigate('/reports');
            }}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports Archive</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF</span>
          </button>
        </div>

        {/* Printable Report Document */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-2xl print:bg-white print:text-black print:p-0">
          <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
            <div>
              <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider block">
                Post-Mortem Incident Report #{selectedReport.id}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">{selectedReport.title}</h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">Generated: {selectedReport.created_at}</p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-mono text-xs font-semibold">
              RESOLVED & VERIFIED
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">1. Executive Summary</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {selectedReport.executive_summary}
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">2. Root Cause Analysis</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-sky-400">Primary Factor: {selectedReport.root_cause_analysis.primary_factor}</div>
              <p className="text-slate-300">{selectedReport.root_cause_analysis.description}</p>
              <div className="text-slate-400 pt-1">
                <strong>Reasoning Summary: </strong>{selectedReport.root_cause_analysis.reasoning_summary}
              </div>
            </div>
          </div>

          {/* Evidence Collected */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">3. Correlated Telemetry Evidence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedReport.evidence_collected.map((ev, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{ev.name}</div>
                  <div className="text-slate-400 text-[11px]">{ev.observation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution & Remediation */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">4. Remediation & Recovery</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
              {selectedReport.remediation_summary}
            </div>
          </div>

          {/* Prevention Recommendations */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">5. Prevention Recommendations</h3>
            <ul className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 list-disc list-inside">
              {selectedReport.prevention_recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Post-Mortem Incident Reports</h1>
          <p className="text-xs text-slate-400 mt-1">AI-generated executive incident summaries and prevention action items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setSelectedReport(rep)}
            className="bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 p-5 rounded-xl space-y-3 cursor-pointer transition-all hover:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-sky-400">{rep.id}</span>
              <span className="text-[11px] font-mono text-slate-500">{rep.created_at.substring(0, 10)}</span>
            </div>

            <h3 className="font-bold text-white text-base leading-snug">{rep.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{rep.executive_summary}</p>

            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 pt-1">
              <span>Read Full Report</span>
              <FileText className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
