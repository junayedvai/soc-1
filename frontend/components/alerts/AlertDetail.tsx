'use client';
import { Alert, Severity } from '@/lib/types';
import { X, Shield, Target, Server, Network, Brain, CheckCircle, ArrowUp, UserPlus } from 'lucide-react';
import { useAegisXStore } from '@/lib/store';

interface AlertDetailProps {
  alert: Alert;
  onClose: () => void;
}

const severityColors: Record<Severity, string> = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Low: 'text-green-400 bg-green-500/10 border-green-500/30',
};

export default function AlertDetail({ alert, onClose }: AlertDetailProps) {
  const { acknowledgeAlert, escalateAlert, resolveAlert, assignAlert } = useAegisXStore();

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-gray-500">{alert.id}</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${severityColors[alert.severity]}`}>
                {alert.severity}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {alert.status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{alert.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* AI Summary */}
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">AI Analysis</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{alert.aiSummary}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                  <Server className="w-3 h-3" /> Affected Host
                </p>
                <p className="text-sm font-mono text-white">{alert.affectedHost}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                  <Network className="w-3 h-3" /> Source IP
                </p>
                <p className="text-sm font-mono text-white">{alert.sourceIP}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Source</p>
                <p className="text-sm text-white">{alert.source}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                <p className="text-sm text-white">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Assignee</p>
                <p className="text-sm text-white">{alert.assignee || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tenant</p>
                <p className="text-sm font-mono text-white">{alert.tenantId}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Description</p>
            <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/50 rounded-lg p-3">{alert.description}</p>
          </div>

          {/* MITRE ATT&CK */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-orange-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">MITRE ATT&CK Tactics</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.mitre.map(tactic => (
                <span
                  key={tactic}
                  className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono rounded-lg"
                >
                  {tactic}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
            {alert.status === 'New' && (
              <button
                onClick={() => handleAction(() => acknowledgeAlert(alert.id))}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Acknowledge
              </button>
            )}
            {alert.severity !== 'Critical' && (
              <button
                onClick={() => handleAction(() => escalateAlert(alert.id))}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-medium transition-all"
              >
                <ArrowUp className="w-4 h-4" />
                Escalate
              </button>
            )}
            {alert.status !== 'Resolved' && alert.status !== 'Closed' && (
              <button
                onClick={() => handleAction(() => resolveAlert(alert.id))}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all"
              >
                <Shield className="w-4 h-4" />
                Resolve
              </button>
            )}
            <button
              onClick={() => handleAction(() => assignAlert(alert.id, 'analyst-01'))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Assign to Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
