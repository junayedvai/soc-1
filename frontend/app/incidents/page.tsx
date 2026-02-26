'use client';
import { useAegisXStore } from '@/lib/store';
import IncidentPanel from '@/components/incidents/IncidentPanel';
import { Shield, AlertTriangle } from 'lucide-react';
import { Severity } from '@/lib/types';

const severityColors: Record<Severity, string> = {
  Critical: 'text-red-400 border-red-500/30 bg-red-500/5',
  High: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
  Medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
  Low: 'text-green-400 border-green-500/30 bg-green-500/5',
};

export default function IncidentsPage() {
  const { incidents, selectedIncidentId, setSelectedIncident } = useAegisXStore();
  const selectedIncident = selectedIncidentId
    ? incidents.find(i => i.id === selectedIncidentId)
    : incidents[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-6 h-6 text-orange-400" />
          Incident Response
        </h1>
        <p className="text-gray-400 text-sm mt-1">{incidents.length} incidents — automated playbook orchestration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Incident List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Incidents</h2>
          {incidents.map(incident => (
            <button
              key={incident.id}
              onClick={() => setSelectedIncident(incident.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all hover:border-gray-600 ${
                (selectedIncident?.id === incident.id)
                  ? 'border-cyan-500/50 bg-cyan-500/5'
                  : severityColors[incident.severity]
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{incident.id}</span>
                    <span className={`text-xs font-semibold ${
                      incident.status === 'Active' ? 'text-red-400' :
                      incident.status === 'Investigating' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>{incident.status}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{incident.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {incident.playbookSteps.filter(s => s.status === 'completed').length}/{incident.playbookSteps.length} steps
                  </p>
                </div>
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-1 ${
                  incident.severity === 'Critical' ? 'text-red-400' :
                  incident.severity === 'High' ? 'text-orange-400' : 'text-yellow-400'
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* Incident Detail */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <IncidentPanel incident={selectedIncident} />
          ) : (
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 flex items-center justify-center text-gray-500 text-sm">
              Select an incident to view playbook
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
