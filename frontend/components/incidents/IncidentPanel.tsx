'use client';
import { Incident, Severity } from '@/lib/types';
import PlaybookStep from './PlaybookStep';
import { Shield, Clock, AlertTriangle } from 'lucide-react';

interface IncidentPanelProps {
  incident: Incident;
}

const severityColors: Record<Severity, string> = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Low: 'text-green-400 bg-green-500/10 border-green-500/30',
};

export default function IncidentPanel({ incident }: IncidentPanelProps) {
  const completedSteps = incident.playbookSteps.filter(s => s.status === 'completed').length;
  const totalSteps = incident.playbookSteps.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-500">{incident.id}</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${severityColors[incident.severity]}`}>
                {incident.severity}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${
                incident.status === 'Active' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                incident.status === 'Investigating' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' :
                'text-gray-400 bg-gray-500/10 border-gray-500/30'
              }`}>
                {incident.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{incident.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(incident.createdAt).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {incident.alertIds.length} linked alerts
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400">Playbook Progress</span>
            <span className="text-cyan-400 font-semibold">{completedSteps}/{totalSteps} steps ({progress}%)</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Playbook Steps */}
      <div className="p-5 space-y-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          Response Playbook
        </h4>
        {incident.playbookSteps.map((step, i) => (
          <PlaybookStep key={step.id} step={step} incidentId={incident.id} index={i} />
        ))}
      </div>
    </div>
  );
}
