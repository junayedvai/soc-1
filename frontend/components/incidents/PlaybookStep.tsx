'use client';
import { PlaybookStep as PlaybookStepType } from '@/lib/types';
import { CheckCircle, XCircle, Clock, Loader, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAegisXStore } from '@/lib/store';

interface PlaybookStepProps {
  step: PlaybookStepType;
  incidentId: string;
  index: number;
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Completed' },
  running: { icon: Loader, color: 'text-yellow-400 animate-spin', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Running' },
  pending: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Failed' },
};

export default function PlaybookStep({ step, incidentId, index }: PlaybookStepProps) {
  const [expanded, setExpanded] = useState(step.status === 'running');
  const { updatePlaybookStep } = useAegisXStore();
  const config = statusConfig[step.status];
  const Icon = config.icon;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${config.bg}`}>
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-400">
          {index + 1}
        </div>
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{step.name}</p>
          <p className="text-xs text-gray-400 truncate">{step.description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.color}`}>{config.label}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800/50">
          <div className="mt-3 space-y-1.5">
            {step.actions.map((action, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                {action}
              </div>
            ))}
          </div>
          {step.status !== 'completed' && step.status !== 'failed' && (
            <div className="flex gap-2 mt-4">
              {step.status === 'pending' && (
                <button
                  onClick={() => updatePlaybookStep(incidentId, step.id, 'running')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium transition-all"
                >
                  <Play className="w-3 h-3" /> Run Step
                </button>
              )}
              {step.status === 'running' && (
                <button
                  onClick={() => updatePlaybookStep(incidentId, step.id, 'completed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-medium transition-all"
                >
                  <CheckCircle className="w-3 h-3" /> Mark Complete
                </button>
              )}
              {step.status === 'running' && (
                <button
                  onClick={() => updatePlaybookStep(incidentId, step.id, 'failed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-all"
                >
                  <XCircle className="w-3 h-3" /> Mark Failed
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
