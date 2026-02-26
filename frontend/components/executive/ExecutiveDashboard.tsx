'use client';
import { mockComplianceFrameworks, mockIncidents, mockAlertTrendData } from '@/lib/mockData';
import { useAegisXStore } from '@/lib/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ExecutiveDashboard() {
  const { getKPIData } = useAegisXStore();
  const kpi = getKPIData();

  const riskTrend = mockAlertTrendData.map(d => ({
    date: d.date,
    score: Math.round((d.Critical * 4 + d.High * 2 + d.Medium) / 2),
  }));

  const totalControlsPassed = mockComplianceFrameworks.reduce((sum, f) => sum + f.passed, 0);
  const totalControls = mockComplianceFrameworks.reduce((sum, f) => sum + f.controls, 0);

  return (
    <div className="space-y-6">
      {/* Security Posture Score */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="#06b6d4" strokeWidth="10"
                strokeDasharray={`${(87 / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-cyan-400">87</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-white mt-3">Security Posture</p>
          <p className="text-xs text-cyan-400 mt-1">GOOD</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-orange-400 mb-2" />
          <p className="text-3xl font-bold text-orange-400">{kpi.activeIncidents}</p>
          <p className="text-xs text-gray-400 mt-1">Active Incidents</p>
          <p className="text-xs text-red-400 mt-1">2 Critical</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <DollarSign className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-3xl font-bold text-yellow-400">$2.4M</p>
          <p className="text-xs text-gray-400 mt-1">Est. Risk Exposure</p>
          <p className="text-xs text-green-400 mt-1">↓12% vs last month</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <Shield className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-3xl font-bold text-green-400">{Math.round((totalControlsPassed / totalControls) * 100)}%</p>
          <p className="text-xs text-gray-400 mt-1">Controls Passed</p>
          <p className="text-xs text-gray-500 mt-1">{totalControlsPassed}/{totalControls}</p>
        </div>
      </div>

      {/* Risk Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Risk Score Trend (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }}
              />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Overview */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Compliance Overview</h3>
          <div className="space-y-3">
            {mockComplianceFrameworks.slice(0, 5).map(fw => (
              <div key={fw.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-28 flex-shrink-0">{fw.name}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${fw.coverage >= 85 ? 'bg-green-500' : fw.coverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${fw.coverage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-white w-10 text-right">{fw.coverage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Incidents */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Top Active Incidents</h3>
        <div className="space-y-3">
          {mockIncidents.map(inc => (
            <div key={inc.id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-800">
              <div className={`w-2 h-full min-h-[40px] rounded-full flex-shrink-0 ${
                inc.severity === 'Critical' ? 'bg-red-500' : inc.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">{inc.id}</span>
                  <span className={`text-xs font-semibold ${
                    inc.severity === 'Critical' ? 'text-red-400' :
                    inc.severity === 'High' ? 'text-orange-400' : 'text-yellow-400'
                  }`}>{inc.severity}</span>
                </div>
                <p className="text-sm font-semibold text-white">{inc.title}</p>
                <p className="text-xs text-gray-500">
                  {inc.playbookSteps.filter(s => s.status === 'completed').length}/{inc.playbookSteps.length} playbook steps completed
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                inc.status === 'Active' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>{inc.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Mean Time to Detect', value: '4.2h', trend: '-18%', good: true },
          { label: 'Mean Time to Respond', value: '12.5h', trend: '-7%', good: true },
          { label: 'Incidents This Month', value: '14', trend: '+3', good: false },
          { label: 'Est. Cost Avoidance', value: '$840K', trend: '+22%', good: true },
        ].map(metric => (
          <div key={metric.label} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500">{metric.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
            <p className={`text-xs mt-1 ${metric.good ? 'text-green-400' : 'text-red-400'}`}>{metric.trend} vs last month</p>
          </div>
        ))}
      </div>
    </div>
  );
}
