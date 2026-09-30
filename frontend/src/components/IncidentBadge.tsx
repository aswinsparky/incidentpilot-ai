import React from 'react';
import { Severity, IncidentStatus } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const colors: Record<Severity, string> = {
    CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[severity]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {severity}
    </span>
  );
};

interface StatusBadgeProps {
  status: IncidentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<IncidentStatus, { bg: string; text: string; dot: string; label: string }> = {
    ACTIVE: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-500 animate-pulse', label: 'Active Alert' },
    INVESTIGATING: { bg: 'bg-sky-500/10 border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-400 animate-ping', label: 'AI Investigating' },
    PENDING_APPROVAL: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Awaiting Approval' },
    REMEDIATING: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400 animate-bounce', label: 'Remediating' },
    RESOLVED: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Resolved' },
  };

  const style = styles[status] || styles.ACTIVE;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${style.bg} ${style.text}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${style.dot}`}></span>
      {style.label}
    </span>
  );
};
