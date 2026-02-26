'use client';
import { BarChart3 } from 'lucide-react';
import ExecutiveDashboard from '@/components/executive/ExecutiveDashboard';

export default function ExecutivePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          Executive Command Center
        </h1>
        <p className="text-gray-400 text-sm mt-1">Security posture, risk metrics, and strategic intelligence for leadership</p>
      </div>
      <ExecutiveDashboard />
    </div>
  );
}
