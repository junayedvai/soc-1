'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockResponseTimeData } from '@/lib/mockData';

const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function ResponseStatusChart() {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Avg Response Time (minutes)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mockResponseTimeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }}
            formatter={(value) => [`${value} min`, 'Avg Response']}
          />
          <Bar dataKey="avgMinutes" radius={[4, 4, 0, 0]}>
            {mockResponseTimeData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
