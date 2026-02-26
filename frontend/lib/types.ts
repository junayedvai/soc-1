export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'New' | 'Acknowledged' | 'Investigating' | 'Resolving' | 'Resolved' | 'Closed';
export type Role = 'SOC Analyst' | 'CISO' | 'Executive';
export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  source: string;
  timestamp: string;
  description: string;
  mitre: string[];
  affectedHost: string;
  sourceIP: string;
  assignee?: string;
  tenantId: string;
  aiSummary: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: string;
  alertIds: string[];
  playbookSteps: PlaybookStep[];
  tenantId: string;
  createdAt: string;
}

export interface PlaybookStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  actions: string[];
}

export interface KPIData {
  totalAlerts: number;
  activeIncidents: number;
  complianceScore: number;
  activeAgents: number;
  globalThreatScore: number;
}

export interface ComplianceFramework {
  name: string;
  coverage: number;
  controls: number;
  passed: number;
  risk: 'Low' | 'Medium' | 'High';
}

export interface ThreatIntel {
  id: string;
  type: string;
  indicator: string;
  confidence: number;
  severity: Severity;
  source: string;
  lastSeen: string;
  tags: string[];
}

export interface LogEvent {
  id: string;
  timestamp: string;
  source: string;
  level: string;
  message: string;
  parsed: Record<string, string>;
}
