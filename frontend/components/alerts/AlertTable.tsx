'use client';
import { Alert, Severity, AlertStatus } from '@/lib/types';
import { Eye, CheckCircle, ArrowUp, UserPlus, XCircle } from 'lucide-react';
import { useAegisXStore } from '@/lib/store';

interface AlertTableProps {
  alerts: Alert[];
  onSelectAlert: (id: string) => void;
}

const severityColors: Record<Severity, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const statusColors: Record<AlertStatus, string> = {
  New: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Acknowledged: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Investigating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Resolving: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  Closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function AlertTable({ alerts, onSelectAlert }: AlertTableProps) {
  const { acknowledgeAlert, resolveAlert, escalateAlert } = useAegisXStore();

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Affected Host</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                  No alerts match the current filters.
                </td>
              </tr>
            ) : (
              alerts.map(alert => (
                <tr
                  key={alert.id}
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-400">{alert.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectAlert(alert.id)}
                      className="text-sm font-medium text-white hover:text-cyan-400 transition-colors text-left max-w-xs truncate block"
                    >
                      {alert.severity === 'Critical' && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-2 animate-pulse" />
                      )}
                      {alert.title}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${severityColors[alert.severity]}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${statusColors[alert.status]}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-400">{alert.source}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-mono text-gray-400">{alert.affectedHost}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectAlert(alert.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {alert.status === 'New' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 transition-all"
                          title="Acknowledge"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {alert.severity !== 'Critical' && (
                        <button
                          onClick={() => escalateAlert(alert.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 transition-all"
                          title="Escalate"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {alert.status !== 'Resolved' && alert.status !== 'Closed' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-all"
                          title="Resolve"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
