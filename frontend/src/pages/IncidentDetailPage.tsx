import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { Incident } from '../types';
import { fetchIncident, triggerInvestigation, approveRemediation } from '../services/api';
import { SeverityBadge, StatusBadge } from '../components/IncidentBadge';
import { MetricCharts } from '../components/MetricCharts';
import { TimelineView } from '../components/TimelineView';
import { LogViewer } from '../components/LogViewer';
import { AIInvestigationPanel } from '../components/AIInvestigationPanel';
import { ApprovalModal } from '../components/ApprovalModal';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'investigation' | 'metrics' | 'logs' | 'timeline'>('investigation');

  const loadIncident = async () => {
    if (!id) return;
    setLoading(true);
    const data = await fetchIncident(id);
    setIncident(data);
    setLoading(false);
  };

  useEffect(() => {
    loadIncident();
  }, [id]);

  const handleStartInvestigation = async () => {
    if (!id) return;
    setIsInvestigating(true);
    try {
      const updated = await triggerInvestigation(id);
      setIncident(updated);
    } catch (err) {
      console.error('Investigation error', err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleConfirmApproval = async (approvedBy: string) => {
    if (!id) return;
    try {
      const updated = await approveRemediation(id, approvedBy);
      setIncident(updated);
    } catch (err) {
      console.error('Approval execution failed', err);
    }
  };

  if (loading || !incident) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400 font-mono text-sm space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
        <span>Loading Incident Telemetry & AI State...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Back Button & Status Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incidents Registry</span>
        </button>

        <button
          onClick={loadIncident}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Incident Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-lg font-bold text-sky-400">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">{incident.title}</h1>
          </div>

          <div className="flex items-center space-x-3">
            {incident.recovery_verified && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recovery Verified</span>
              </div>
            )}

            <button
              onClick={() => navigate(`/reports/${incident.id}`)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Post-Mortem Report</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-500 text-[10px] block uppercase">Target Service</span>
            <span className="text-sky-400 font-bold">{incident.service}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-500 text-[10px] block uppercase">Created Time</span>
            <span className="text-slate-300">
              {incident.created_at.length > 19 ? incident.created_at.substring(11, 19) : incident.created_at}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-500 text-[10px] block uppercase">RCA Confidence</span>
            <span className="text-emerald-400 font-bold">
              {incident.root_cause ? `${Math.round(incident.root_cause.confidence * 100)}%` : 'Pending'}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-500 text-[10px] block uppercase">Human Approval</span>
            <span className={incident.remediation_approved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {incident.remediation_approved ? 'Approved' : 'Pending Action'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('investigation')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'investigation' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Investigation & RCA
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'metrics' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          CloudWatch Metrics
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'logs' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Application Logs ({incident.logs.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'timeline' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Event Timeline ({incident.timeline.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'investigation' && (
          <AIInvestigationPanel
            incident={incident}
            onStartInvestigation={handleStartInvestigation}
            isInvestigating={isInvestigating}
            onOpenApproval={() => setIsApprovalOpen(true)}
          />
        )}

        {activeTab === 'metrics' && <MetricCharts metrics={incident.metrics} />}

        {activeTab === 'logs' && <LogViewer logs={incident.logs} />}

        {activeTab === 'timeline' && <TimelineView timeline={incident.timeline} />}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onConfirm={handleConfirmApproval}
        recommendation={incident.recommendation}
        serviceName={incident.service}
      />
    </div>
  );
};
