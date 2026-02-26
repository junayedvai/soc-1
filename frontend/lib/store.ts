'use client';

import { create } from 'zustand';
import { Alert, AlertStatus, Incident, PlaybookStep, Role } from './types';
import { mockAlerts, mockIncidents, mockKPIData } from './mockData';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

interface AegisXStore {
  alerts: Alert[];
  incidents: Incident[];
  role: Role;
  tenantId: string;
  notifications: Notification[];
  selectedAlertId: string | null;
  selectedIncidentId: string | null;
  sidebarCollapsed: boolean;

  getKPIData: () => typeof mockKPIData;
  getUnreadNotifications: () => number;
  getAlertsByStatus: (status: AlertStatus) => Alert[];
  getAlertsBySeverity: (severity: string) => Alert[];

  setSelectedAlert: (id: string | null) => void;
  acknowledgeAlert: (id: string) => void;
  escalateAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  assignAlert: (id: string, assignee: string) => void;
  updateAlertStatus: (id: string, status: AlertStatus) => void;

  setSelectedIncident: (id: string | null) => void;
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => void;
  updatePlaybookStep: (incidentId: string, stepId: string, status: PlaybookStep['status']) => void;

  setRole: (role: Role) => void;
  toggleSidebar: () => void;
  addNotification: (message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAegisXStore = create<AegisXStore>((set, get) => ({
  alerts: mockAlerts,
  incidents: mockIncidents,
  role: 'SOC Analyst',
  tenantId: 'tenant-001',
  notifications: [
    { id: 'n1', message: 'Critical: Ransomware detected on finance-ws-03', type: 'error', timestamp: new Date().toISOString(), read: false },
    { id: 'n2', message: 'Incident INC-001 escalated to Critical', type: 'warning', timestamp: new Date().toISOString(), read: false },
    { id: 'n3', message: 'Compliance scan completed - 87% score', type: 'info', timestamp: new Date().toISOString(), read: true },
  ],
  selectedAlertId: null,
  selectedIncidentId: null,
  sidebarCollapsed: false,

  getKPIData: () => {
    const { alerts, incidents } = get();
    const activeIncidents = incidents.filter(i => i.status === 'Active' || i.status === 'Investigating').length;
    return {
      ...mockKPIData,
      totalAlerts: alerts.filter(a => a.status !== 'Closed' && a.status !== 'Resolved').length,
      activeIncidents,
    };
  },

  getUnreadNotifications: () => get().notifications.filter(n => !n.read).length,
  getAlertsByStatus: (status) => get().alerts.filter(a => a.status === status),
  getAlertsBySeverity: (severity) => get().alerts.filter(a => a.severity === severity),

  setSelectedAlert: (id) => set({ selectedAlertId: id }),

  acknowledgeAlert: (id) => {
    set(state => ({
      alerts: state.alerts.map(a =>
        a.id === id ? { ...a, status: 'Acknowledged' as AlertStatus } : a
      ),
    }));
    get().addNotification(`Alert ${id} acknowledged`, 'info');
  },

  escalateAlert: (id) => {
    set(state => ({
      alerts: state.alerts.map(a =>
        a.id === id && a.severity !== 'Critical' ? { ...a, severity: 'Critical' } : a
      ),
    }));
    get().addNotification(`Alert ${id} escalated to Critical`, 'warning');
  },

  resolveAlert: (id) => {
    set(state => ({
      alerts: state.alerts.map(a =>
        a.id === id ? { ...a, status: 'Resolved' as AlertStatus } : a
      ),
    }));
    get().addNotification(`Alert ${id} resolved`, 'success');
  },

  assignAlert: (id, assignee) => {
    set(state => ({
      alerts: state.alerts.map(a =>
        a.id === id ? { ...a, assignee, status: 'Investigating' as AlertStatus } : a
      ),
    }));
    get().addNotification(`Alert ${id} assigned to ${assignee}`, 'info');
  },

  updateAlertStatus: (id, status) => {
    set(state => ({
      alerts: state.alerts.map(a =>
        a.id === id ? { ...a, status } : a
      ),
    }));
  },

  setSelectedIncident: (id) => set({ selectedIncidentId: id }),

  createIncident: (incident) => {
    const newIncident: Incident = {
      ...incident,
      id: `INC-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set(state => ({ incidents: [...state.incidents, newIncident] }));
    get().addNotification(`Incident ${newIncident.id} created`, 'warning');
  },

  updatePlaybookStep: (incidentId, stepId, status) => {
    set(state => ({
      incidents: state.incidents.map(inc =>
        inc.id === incidentId
          ? {
              ...inc,
              playbookSteps: inc.playbookSteps.map(step =>
                step.id === stepId ? { ...step, status } : step
              ),
            }
          : inc
      ),
    }));
  },

  setRole: (role) => set({ role }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addNotification: (message, type) => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set(state => ({ notifications: [notification, ...state.notifications].slice(0, 20) }));
  },

  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  },

  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },
}));
