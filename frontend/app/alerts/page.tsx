'use client';
import { useState } from 'react';
import { useAegisXStore } from '@/lib/store';
import AlertTable from '@/components/alerts/AlertTable';
import AlertDetail from '@/components/alerts/AlertDetail';
import { AlertTriangle, Filter } from 'lucide-react';
import { Severity, AlertStatus } from '@/lib/types';

export default function AlertsPage() {
  const { alerts, selectedAlertId, setSelectedAlert } = useAegisXStore();
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const severities: string[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const statuses: string[] = ['All', 'New', 'Acknowledged', 'Investigating', 'Resolving', 'Resolved', 'Closed'];
  const sources = ['All', ...Array.from(new Set(alerts.map(a => a.source)))];

  const filtered = alerts.filter(a => {
    if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (sourceFilter !== 'All' && a.source !== sourceFilter) return false;
    return true;
  });

  const selectedAlert = selectedAlertId ? alerts.find(a => a.id === selectedAlertId) : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Alert Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} alerts shown of {alerts.length} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {severities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Source</label>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Severity summary */}
        <div className="ml-auto flex gap-3">
          {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map(sev => {
            const count = alerts.filter(a => a.severity === sev && a.status !== 'Closed' && a.status !== 'Resolved').length;
            const colors: Record<Severity, string> = {
              Critical: 'text-red-400 bg-red-500/10 border-red-500/20',
              High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
              Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
              Low: 'text-green-400 bg-green-500/10 border-green-500/20',
            };
            return (
              <div key={sev} className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${colors[sev]}`}>
                {sev}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Table */}
      <AlertTable alerts={filtered} onSelectAlert={setSelectedAlert} />

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}
