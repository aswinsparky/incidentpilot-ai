import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertOctagon, Cpu, Bot, FileText, Settings, Home } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Landing Page', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incidents', icon: AlertOctagon },
    { to: '/infrastructure', label: 'Infrastructure', icon: Cpu },
    { to: '/reports', label: 'Incident Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
          Operational Views
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center space-x-2 text-sky-400 font-semibold">
            <Bot className="w-4 h-4" />
            <span>AI SRE Supervisor</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            LangGraph Agent State Machine active. Human approval required for all mutations.
          </p>
        </div>
      </div>
    </aside>
  );
};
