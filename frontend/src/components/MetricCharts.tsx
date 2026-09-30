import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MetricPoint } from '../types';

interface MetricChartsProps {
  metrics: MetricPoint[];
}

export const MetricCharts: React.FC<MetricChartsProps> = ({ metrics }) => {
  const formattedData = metrics.map((m) => ({
    ...m,
    time: m.timestamp.length > 16 ? m.timestamp.substring(11, 16) : m.timestamp,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Memory Chart */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Memory Utilization</span>
          <span className="text-sm font-bold text-rose-400">
            {metrics.length > 0 ? `${metrics[metrics.length - 1].memory_utilization}%` : 'N/A'}
          </span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="memory_utilization" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#memGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latency Chart */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">API Response Latency</span>
          <span className="text-sm font-bold text-amber-400">
            {metrics.length > 0 ? `${metrics[metrics.length - 1].latency_ms} ms` : 'N/A'}
          </span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="ms" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="latency_ms" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#latGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5xx Error Rate Chart */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">HTTP 5xx Error Rate</span>
          <span className="text-sm font-bold text-rose-500">
            {metrics.length > 0 ? `${metrics[metrics.length - 1].error_rate_pct}%` : 'N/A'}
          </span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="error_rate_pct" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#errGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CPU Utilization Chart */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">CPU Utilization</span>
          <span className="text-sm font-bold text-sky-400">
            {metrics.length > 0 ? `${metrics[metrics.length - 1].cpu_utilization}%` : 'N/A'}
          </span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="cpu_utilization" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#cpuGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
