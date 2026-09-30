import React, { useState } from 'react';
import { Search, Terminal, Filter } from 'lucide-react';
import { LogEntry } from '../types';

interface LogViewerProps {
  logs: LogEntry[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'ERROR':
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'WARN':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-slate-300 font-sans font-semibold">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>CloudWatch Application Log Stream</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1 text-slate-200 focus:outline-none focus:border-sky-500 w-44"
            />
          </div>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Levels</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 max-h-72 overflow-y-auto space-y-1.5 selection:bg-sky-500/30">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 py-6 text-center italic">No matching log entries found</div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="flex items-start space-x-2 font-mono py-1 border-b border-slate-900/80 last:border-0 hover:bg-slate-900/40 px-1 rounded">
              <span className="text-slate-500 shrink-0">{log.timestamp.length > 19 ? log.timestamp.substring(11, 19) : log.timestamp}</span>
              <span className={`px-1.5 py-0.2 rounded border font-semibold text-[10px] shrink-0 ${getLevelStyle(log.level)}`}>
                {log.level}
              </span>
              <span className="text-slate-400 shrink-0">[{log.service}]</span>
              <span className="text-slate-200 break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
