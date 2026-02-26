'use client';
import { AlertTriangle, Shield, CheckSquare, Server, Activity, Globe, Brain, BarChart3 } from 'lucide-react';
import { useAegisXStore } from '@/lib/store';
import KPICard from '@/components/dashboard/KPICard';
import AlertSeverityChart from '@/components/dashboard/AlertSeverityChart';
import SeverityTrendChart from '@/components/dashboard/SeverityTrendChart';
import ResponseStatusChart from '@/components/dashboard/ResponseStatusChart';
import FeatureTile from '@/components/dashboard/FeatureTile';

export default function DashboardPage() {
  const { getKPIData } = useAegisXStore();
  const kpi = getKPIData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Security Operations Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time threat monitoring and incident response platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Alerts"
          value={kpi.totalAlerts}
          change={12}
          icon={AlertTriangle}
          color="text-red-400"
          subtitle="Active alerts"
        />
        <KPICard
          title="Active Incidents"
          value={kpi.activeIncidents}
          change={5}
          icon={Shield}
          color="text-orange-400"
          subtitle="Needs attention"
        />
        <KPICard
          title="Compliance Score"
          value={`${kpi.complianceScore}%`}
          change={-3}
          icon={CheckSquare}
          color="text-green-400"
          subtitle="Across 8 frameworks"
        />
        <KPICard
          title="Active Agents"
          value={kpi.activeAgents}
          icon={Server}
          color="text-blue-400"
          subtitle="Monitoring endpoints"
        />
        <KPICard
          title="Threat Score"
          value={kpi.globalThreatScore}
          change={8}
          icon={Activity}
          color="text-yellow-400"
          subtitle="Global threat index"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AlertSeverityChart />
        <div className="lg:col-span-2">
          <SeverityTrendChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponseStatusChart />

        {/* Recent Critical Alerts */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Critical Alerts</h3>
          <div className="space-y-3">
            {[
              { id: 'ALT-001', title: 'Brute Force Attack Detected', host: 'web-server-01', time: '08:23' },
              { id: 'ALT-002', title: 'Ransomware Behavior Detected', host: 'finance-ws-03', time: '07:45' },
              { id: 'ALT-016', title: 'Insider Threat Indicator', host: 'file-server-01', time: '09:00' },
            ].map(alert => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.host}</p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Tiles */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform Modules</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureTile
            href="/alerts"
            icon={AlertTriangle}
            title="Alert Management"
            description="Triage, investigate and respond to security alerts"
            metric="16 active alerts"
            color="bg-red-500/10 text-red-400"
          />
          <FeatureTile
            href="/incidents"
            icon={Shield}
            title="Incident Response"
            description="Automated playbooks and incident tracking"
            metric="3 active incidents"
            color="bg-orange-500/10 text-orange-400"
          />
          <FeatureTile
            href="/threat-landscape"
            icon={Globe}
            title="Threat Landscape"
            description="Global threat intelligence and MITRE ATT&CK coverage"
            metric="5 IOCs tracked"
            color="bg-purple-500/10 text-purple-400"
          />
          <FeatureTile
            href="/compliance"
            icon={CheckSquare}
            title="Compliance"
            description="Multi-framework compliance monitoring and reporting"
            metric="87% avg coverage"
            color="bg-green-500/10 text-green-400"
          />
          <FeatureTile
            href="/executive"
            icon={BarChart3}
            title="Executive View"
            description="C-suite security posture and risk reporting"
            metric="Risk: Medium"
            color="bg-blue-500/10 text-blue-400"
          />
          <FeatureTile
            href="/ai-analysis"
            icon={Brain}
            title="AI Log Analysis"
            description="Machine learning powered log parsing and anomaly detection"
            metric="AI-powered"
            color="bg-cyan-500/10 text-cyan-400"
          />
          <FeatureTile
            href="/alerts"
            icon={Server}
            title="Asset Inventory"
            description="Monitor and manage all endpoint agents and sensors"
            metric="234 active agents"
            color="bg-yellow-500/10 text-yellow-400"
          />
          <FeatureTile
            href="/threat-landscape"
            icon={Activity}
            title="Threat Intelligence"
            description="IOC feeds, threat actors and intelligence correlation"
            metric="Global coverage"
            color="bg-pink-500/10 text-pink-400"
          />
        </div>
      </div>
    </div>
  );
}
