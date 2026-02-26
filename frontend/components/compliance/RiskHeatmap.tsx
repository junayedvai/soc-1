'use client';
import { ComplianceFramework } from '@/lib/types';

interface RiskHeatmapProps {
  frameworks: ComplianceFramework[];
}

const categories = ['Access Control', 'Cryptography', 'Incident Resp.', 'Network Sec.', 'Data Privacy', 'Audit & Log'];

const riskMap = [
  [85, 92, 78, 88, 91, 76],
  [72, 65, 88, 70, 83, 69],
  [90, 88, 75, 92, 87, 80],
  [68, 71, 82, 65, 74, 61],
  [95, 89, 91, 87, 93, 88],
  [61, 58, 70, 63, 66, 55],
  [55, 62, 68, 59, 71, 50],
  [75, 80, 72, 78, 76, 70],
];

function getColor(value: number): string {
  if (value >= 85) return 'bg-green-500/30 text-green-400 border-green-500/20';
  if (value >= 70) return 'bg-yellow-500/30 text-yellow-400 border-yellow-500/20';
  if (value >= 55) return 'bg-orange-500/30 text-orange-400 border-orange-500/20';
  return 'bg-red-500/30 text-red-400 border-red-500/20';
}

export default function RiskHeatmap({ frameworks }: RiskHeatmapProps) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Risk Heatmap — Framework × Control Category</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-gray-500 font-medium w-32">Framework</th>
              {categories.map(cat => (
                <th key={cat} className="px-1 py-2 text-center text-gray-500 font-medium min-w-[80px]">{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {frameworks.map((fw, fwIdx) => (
              <tr key={fw.name}>
                <td className="px-2 py-2 text-gray-300 font-medium text-xs whitespace-nowrap">{fw.name}</td>
                {categories.map((_, catIdx) => {
                  const val = riskMap[fwIdx]?.[catIdx] ?? 70;
                  return (
                    <td key={catIdx} className="px-1 py-1">
                      <div className={`border rounded-md px-1 py-1.5 text-center font-semibold ${getColor(val)}`}>
                        {val}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/20" />85%+ Good</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/20" />70-85% Medium</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500/20" />55-70% Low</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/20" />&lt;55% Critical</div>
      </div>
    </div>
  );
}
