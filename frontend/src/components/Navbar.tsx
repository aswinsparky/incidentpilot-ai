import React from 'react';
import { Shield, Bell, Sparkles, Server, Terminal, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onSimulateDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSimulateDemo }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Link to="/dashboard" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">IncidentPilot</span>
              <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono px-1.5 py-0.5 rounded font-semibold">AI SRE</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">FROM ALERT TO RESOLUTION</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Hackathon Demo Mode Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AWS Demo Environment: Active</span>
        </div>

        <button
          onClick={() => {
            onSimulateDemo();
            navigate('/dashboard');
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-sky-500/20 hover:shadow-sky-500/40 transition-all active:scale-95"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Simulate Incident</span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
            SRE
          </div>
        </div>
      </div>
    </header>
  );
};
