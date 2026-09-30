import React from 'react';
import { GitCommit, AlertCircle, Activity, Bot, CheckCircle2, ShieldAlert } from 'lucide-react';
import { IncidentEvent } from '../types';

interface TimelineViewProps {
  timeline: IncidentEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'deployment':
        return <GitCommit className="w-4 h-4 text-purple-400" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'telemetry':
        return <Activity className="w-4 h-4 text-amber-400" />;
      case 'ai_agent':
        return <Bot className="w-4 h-4 text-sky-400" />;
      case 'remediation':
        return <ShieldAlert className="w-4 h-4 text-indigo-400" />;
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">Incident Event Timeline</h3>
        <span className="text-xs text-slate-400">{timeline.length} Recorded Events</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event) => (
          <div key={event.id} className="relative flex items-start space-x-3 group">
            <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
              {getIcon(event.category)}
            </div>

            <div className="flex-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 group-hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{event.title}</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {event.timestamp.length > 16 ? event.timestamp.substring(11, 19) : event.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
