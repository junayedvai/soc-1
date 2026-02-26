'use client';
import { mockComplianceFrameworks } from '@/lib/mockData';
import RiskHeatmap from './RiskHeatmap';
import { CheckSquare, AlertTriangle, TrendingUp } from 'lucide-react';

const riskColors = {
  Low: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  High: 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function ComplianceDashboard() {
  const avgCoverage = Math.round(
    mockComplianceFrameworks.reduce((sum, f) => sum + f.coverage, 0) / mockComplianceFrameworks.length
  );

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-green-400">{avgCoverage}%</p>
          <p className="text-xs text-gray-400 mt-1">Average Coverage</p>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-400">{mockComplianceFrameworks.length}</p>
          <p className="text-xs text-gray-400 mt-1">Active Frameworks</p>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-yellow-400">
            {mockComplianceFrameworks.filter(f => f.risk === 'High').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">High Risk Areas</p>
        </div>
      </div>

      {/* Framework Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockComplianceFrameworks.map(fw => (
          <div key={fw.name} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">{fw.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{fw.passed}/{fw.controls} controls</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${riskColors[fw.risk]}`}>
                {fw.risk}
              </span>
            </div>

            {/* Coverage bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Coverage</span>
                <span className={`font-bold ${fw.coverage >= 85 ? 'text-green-400' : fw.coverage >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {fw.coverage}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${fw.coverage >= 85 ? 'bg-green-500' : fw.coverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${fw.coverage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <CheckSquare className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-400">{fw.passed} passed</span>
              <span className="mx-1 text-gray-600">|</span>
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-gray-400">{fw.controls - fw.passed} failing</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Heatmap */}
      <RiskHeatmap frameworks={mockComplianceFrameworks} />

      {/* Upcoming Audits */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Upcoming Compliance Activities
        </h3>
        <div className="space-y-2">
          {[
            { name: 'SOC 2 Type II Annual Audit', date: 'Feb 15, 2024', status: 'Scheduled', risk: 'Low' },
            { name: 'PCI DSS Quarterly Scan', date: 'Jan 30, 2024', status: 'Due Soon', risk: 'Medium' },
            { name: 'GDPR DPIA Review', date: 'Jan 25, 2024', status: 'Overdue', risk: 'High' },
            { name: 'ISO 27001 Surveillance Audit', date: 'Mar 10, 2024', status: 'Scheduled', risk: 'Low' },
          ].map(activity => (
            <div key={activity.name} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{activity.name}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${riskColors[activity.risk as 'Low' | 'Medium' | 'High']}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
