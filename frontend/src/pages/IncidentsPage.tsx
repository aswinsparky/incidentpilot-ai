import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Filter, Search, ArrowUpRight } from 'lucide-react';
import { Incident } from '../types';
import { fetchIncidents } from '../services/api';
import { SeverityBadge, StatusBadge } from '../components/IncidentBadge';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidents().then(setIncidents);
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
                        inc.service.toLowerCase().includes(search.toLowerCase()) ||
                        inc.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cloud Incidents Registry</h1>
          <p className="text-xs text-slate-400 mt-1">Audit log of all detected, active, and resolved incident cases</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-52"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Time</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((inc) => (
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
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {inc.created_at.length > 19 ? inc.created_at.substring(0, 19).replace('T', ' ') : inc.created_at}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      <span>View Detail</span>
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
