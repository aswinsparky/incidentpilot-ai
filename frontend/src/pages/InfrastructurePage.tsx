import React from 'react';
import { Cpu, Server, Database, Cloud, Shield, Activity } from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AWS Infrastructure Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">Live serverless resources, containers, and database clusters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lambda API Engine */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AWS Lambda API</h3>
              <span className="text-xs text-slate-400 font-mono">Python 3.12 Runtime</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Function Name:</span>
              <span className="text-sky-400 font-semibold">IncidentPilot-BackendAPI</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Memory Allocated:</span>
              <span>512 MB</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Concurrency:</span>
              <span className="text-emerald-400">Auto-scaling</span>
            </div>
          </div>
        </div>

        {/* DynamoDB Datastore */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Amazon DynamoDB</h3>
              <span className="text-xs text-slate-400 font-mono">On-Demand Capacity</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Tables:</span>
              <span className="text-sky-400 font-semibold">Incidents, Events, Reports</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Billing Model:</span>
              <span className="text-emerald-400">Pay Per Request</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Encryption:</span>
              <span>KMS AWS Managed</span>
            </div>
          </div>
        </div>

        {/* Amazon Bedrock */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Amazon Bedrock</h3>
              <span className="text-xs text-slate-400 font-mono">Multi-Agent AI Model</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Model ID:</span>
              <span className="text-purple-400 font-semibold">anthropic.claude-3-haiku</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Orchestration:</span>
              <span className="text-sky-400 font-semibold">LangGraph State Machine</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500">Safety Gate:</span>
              <span className="text-emerald-400">Human Approval Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
