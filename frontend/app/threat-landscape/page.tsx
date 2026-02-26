'use client';
import { mockThreatIntel, mockGeoThreatData } from '@/lib/mockData';
import { Globe, Shield, Target, Activity } from 'lucide-react';
import { Severity } from '@/lib/types';

const severityColors: Record<Severity, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

// Simplified MITRE ATT&CK tactics
const mitreTactics = [
  { id: 'TA0001', name: 'Initial Access', covered: true, techniques: 5 },
  { id: 'TA0002', name: 'Execution', covered: true, techniques: 8 },
  { id: 'TA0003', name: 'Persistence', covered: true, techniques: 6 },
  { id: 'TA0004', name: 'Privilege Escalation', covered: true, techniques: 7 },
  { id: 'TA0005', name: 'Defense Evasion', covered: false, techniques: 12 },
  { id: 'TA0006', name: 'Credential Access', covered: true, techniques: 9 },
  { id: 'TA0007', name: 'Discovery', covered: true, techniques: 11 },
  { id: 'TA0008', name: 'Lateral Movement', covered: false, techniques: 4 },
  { id: 'TA0009', name: 'Collection', covered: true, techniques: 6 },
  { id: 'TA0010', name: 'Exfiltration', covered: true, techniques: 5 },
  { id: 'TA0011', name: 'Command & Control', covered: false, techniques: 8 },
  { id: 'TA0040', name: 'Impact', covered: true, techniques: 7 },
];

const countryFlags: Record<string, string> = {
  Russia: '🇷🇺',
  China: '🇨🇳',
  'North Korea': '🇰🇵',
  Iran: '🇮🇷',
  Brazil: '🇧🇷',
};

export default function ThreatLandscapePage() {
  const maxThreats = Math.max(...mockGeoThreatData.map(g => g.threats));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Globe className="w-6 h-6 text-purple-400" />
          Threat Landscape
        </h1>
        <p className="text-gray-400 text-sm mt-1">Global threat intelligence, IOC tracking, and MITRE ATT&CK coverage</p>
      </div>

      {/* Global Threat Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="#f97316" strokeWidth="12"
                strokeDasharray={`${(73 / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-orange-400">73</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-white mt-3">Global Threat Score</p>
          <p className="text-xs text-orange-400 mt-1">HIGH RISK</p>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: 'Active IOCs', value: '5', icon: Target, color: 'text-red-400' },
            { label: 'Threat Actors', value: '12', icon: Shield, color: 'text-orange-400' },
            { label: 'Campaigns', value: '3', icon: Activity, color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Threat Intel Feed */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">Threat Intelligence Feed</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800">
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Type</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Indicator</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Severity</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Confidence</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {mockThreatIntel.map(ioc => (
                  <tr key={ioc.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-xs font-mono">{ioc.type}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-300 max-w-[160px] truncate">{ioc.indicator}</td>
                    <td className="px-4 py-3">
                      <span className={`px-1.5 py-0.5 rounded border text-xs font-semibold ${severityColors[ioc.severity]}`}>
                        {ioc.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-cyan-500 h-1.5 rounded-full"
                            style={{ width: `${ioc.confidence}%` }}
                          />
                        </div>
                        <span className="text-gray-400">{ioc.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{ioc.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Origins */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Threat Origins</h3>
          <div className="space-y-3">
            {mockGeoThreatData.map(geo => (
              <div key={geo.country} className="flex items-center gap-3">
                <span className="text-2xl">{countryFlags[geo.country]}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{geo.country}</span>
                    <span className="text-xs text-gray-400 font-semibold">{geo.threats} threats</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full"
                      style={{ width: `${(geo.threats / maxThreats) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-400" />
          MITRE ATT&CK Coverage Matrix
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {mitreTactics.map(tactic => (
            <div
              key={tactic.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                tactic.covered
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-gray-800/50 border-gray-700 text-gray-500'
              }`}
            >
              <p className="text-xs font-mono text-gray-500 mb-1">{tactic.id}</p>
              <p className="text-xs font-semibold leading-tight">{tactic.name}</p>
              <p className="text-xs mt-1 opacity-70">{tactic.techniques} techniques</p>
              <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${tactic.covered ? 'bg-cyan-400' : 'bg-gray-600'}`} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500/50" />
            Covered ({mitreTactics.filter(t => t.covered).length})
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gray-700 border border-gray-600" />
            Not Covered ({mitreTactics.filter(t => !t.covered).length})
          </div>
        </div>
      </div>
    </div>
  );
}
