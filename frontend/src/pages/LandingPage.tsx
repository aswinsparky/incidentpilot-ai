import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Activity, CheckCircle, ArrowRight, Server, Lock, Cpu, PlayCircle } from 'lucide-react';

interface LandingPageProps {
  onSimulateDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSimulateDemo }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header / Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">IncidentPilot AI</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              onSimulateDemo();
              navigate('/dashboard');
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Launch Live Demo</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center space-y-8 relative">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AWS Zero to Shipped Hackathon Showcase</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          From Alert to Resolution: <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Autonomous Incident Investigation
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Correlate CloudWatch metrics, application logs, and deployment events in seconds. Powered by Bedrock & LangGraph state machines with mandatory human approval gating.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
          >
            <span>Open Operational Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            onClick={() => {
              onSimulateDemo();
              navigate('/dashboard');
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-base transition-all hover:scale-105"
          >
            <PlayCircle className="w-5 h-5 text-sky-400" />
            <span>Simulate Outage Scenario</span>
          </button>
        </div>
      </section>

      {/* Core Workflow */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-900">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">End-to-End Autonomous Incident Workflow</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From initial telemetry anomaly to human approval and recovery verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">1</div>
            <h3 className="text-base font-bold text-white">Alert Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CloudWatch Alarms & EventBridge detect latency spikes, memory exhaustion, or 5xx error bursts.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">2</div>
            <h3 className="text-base font-bold text-white">Multi-Agent RCA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LangGraph state agents correlate metrics, log entries, and deployment timestamps to determine root cause.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">3</div>
            <h3 className="text-base font-bold text-white">Human Approval Gate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI formulates safe action plans. Destructive execution is strictly blocked until authorized by SREs.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">4</div>
            <h3 className="text-base font-bold text-white">Verified Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated rollback or scale triggers, followed by telemetry recovery verification and post-mortem export.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
