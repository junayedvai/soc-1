'use client';
import { CheckSquare } from 'lucide-react';
import ComplianceDashboard from '@/components/compliance/ComplianceDashboard';

export default function CompliancePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CheckSquare className="w-6 h-6 text-green-400" />
          Compliance Management
        </h1>
        <p className="text-gray-400 text-sm mt-1">Multi-framework compliance monitoring, risk assessment, and audit management</p>
      </div>
      <ComplianceDashboard />
    </div>
  );
}
