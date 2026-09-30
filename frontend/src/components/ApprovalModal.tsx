import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Recommendation } from '../types';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (approvedBy: string) => void;
  recommendation?: Recommendation;
  serviceName: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recommendation,
  serviceName
}) => {
  const [approvedBy, setApprovedBy] = useState('sre-lead@company.com');

  if (!isOpen || !recommendation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Human Approval Required</h3>
            <p className="text-xs text-slate-400">Confirm IAM-authorized safe remediation execution</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Target Service:</span>
            <span className="text-sky-400 font-bold">{serviceName}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Action:</span>
            <span className="text-white font-bold capitalize">{recommendation.action.replace('_', ' ')}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Risk Level:</span>
            <span className="text-amber-400 font-bold">{recommendation.risk}</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400">Expected Outcome:</span>
            <p className="text-slate-300 font-sans text-xs bg-slate-900 p-2 rounded border border-slate-800">
              {recommendation.expected_result}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Approver Identity (Email / IAM Role)</label>
          <input
            type="email"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            placeholder="sre-lead@company.com"
          />
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-300 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Executing this action will trigger a automated AWS deployment rollback / parameter scale. Post-execution telemetry verification will run automatically.
          </span>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(approvedBy);
              onClose();
            }}
            className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Execute Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
