import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle2, Clock, ShieldCheck, PlayCircle, ArrowUpRight, Cpu } from 'lucide-react';
import { Incident, DashboardStats } from '../types';
import { fetchDashboardStats, fetchIncidents, simulateDemoIncident } from '../services/api';
import { SeverityBadge, StatusBadge } from '../components/IncidentBadge';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    const [sData, iData] = await Promise.all([fetchDashboardStats(), fetchIncidents()]);
    setStats(sData);
    setIncidents(iData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulate = async (scenario: string) => {
    const newInc = await simulateDemoIncident(scenario);
    await loadData();
    navigate(`/incidents/${newInc.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SRE Operational Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time AWS CloudWatch telemetry & autonomous AI agent investigation engine</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AWS Infrastructure: System Degraded</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            <span>Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {stats?.active_incidents ?? 1}
          </div>
          <div className="text-[11px] text-slate-500">Requires investigation & action</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            <span>Resolved Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {stats?.resolved_today ?? 8}
          </div>
          <div className="text-[11px] text-slate-500">Human approved remediations</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            <span>Mean Time to Resolve</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-sky-400 font-mono">
            {stats?.mttr ?? '8m 21s'}
          </div>
          <div className="text-[11px] text-slate-500">Down from 45m manual MTTR</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            <span>AI Investigations</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-400 font-mono">
            {stats?.ai_investigations_run ?? 12}
          </div>
          <div className="text-[11px] text-slate-500">LangGraph state graphs executed</div>
        </div>
      </div>

      {/* Service Health Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
          Production Service Health
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.services.map((svc) => (
            <div
              key={svc.name}
              className={`bg-slate-900/60 border p-5 rounded-xl space-y-3 transition-colors ${
                svc.status === 'DEGRADED' ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-white text-sm">{svc.name}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    svc.status === 'DEGRADED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {svc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">CPU</span>
                  <span className="text-slate-200 font-bold">{svc.cpu_utilization}</span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">MEMORY</span>
                  <span className={svc.status === 'DEGRADED' ? 'text-rose-400 font-bold' : 'text-slate-200 font-bold'}>
                    {svc.memory_utilization}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">LATENCY</span>
                  <span className={svc.status === 'DEGRADED' ? 'text-amber-400 font-bold' : 'text-slate-200 font-bold'}>
                    {svc.latency}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">5XX ERROR</span>
                  <span className={svc.status === 'DEGRADED' ? 'text-rose-400 font-bold' : 'text-slate-200 font-bold'}>
                    {svc.error_rate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Scenario Launcher */}
      <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-950 border border-sky-500/30 p-5 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2">
          <PlayCircle className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-white">Hackathon Demo Incident Simulator</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Trigger deterministic outage scenarios to evaluate IncidentPilot AI investigation, RCA evidence correlation, confidence calculation, and human approval workflows.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSimulate('deployment_failure')}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Scenario 1: Deployment Failure
          </button>
          <button
            onClick={() => handleSimulate('db_degradation')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Scenario 2: DB Degradation
          </button>
          <button
            onClick={() => handleSimulate('traffic_spike')}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Scenario 3: Traffic Spike
          </button>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Recent Incidents Feed
          </h3>
          <span className="text-xs text-slate-500">{incidents.length} Total Incidents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{inc.id}</td>
                  <td className="py-3.5 px-4 font-medium max-w-md truncate">{inc.title}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{inc.service}</td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={inc.severity} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
