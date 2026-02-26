'use client';
import { useState, useEffect } from 'react';
import { Bell, Search, Shield, ChevronDown, Check, X } from 'lucide-react';
import { useAegisXStore } from '@/lib/store';
import { Role } from '@/lib/types';

const roles: Role[] = ['SOC Analyst', 'CISO', 'Executive'];

const threatColors: Record<string, string> = {
  low: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  critical: 'text-red-400 bg-red-400/10 border-red-400/30',
};

function getThreatLevel(score: number): string {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export default function TopBar() {
  const { role, setRole, notifications, markNotificationRead, markAllNotificationsRead, getKPIData, getUnreadNotifications } =
    useAegisXStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const kpi = getKPIData();
  const threatLevel = getThreatLevel(kpi.globalThreatScore);
  const unreadCount = getUnreadNotifications();

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifTypeColor: Record<string, string> = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
    info: 'text-blue-400',
  };

  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center px-6 gap-4 flex-shrink-0 z-40">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search alerts, incidents, IPs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Threat Level */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wide ${threatColors[threatLevel]}`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Threat: {threatLevel}</span>
          <span className="font-bold">{kpi.globalThreatScore}</span>
        </div>

        {/* Time */}
        <div className="text-xs text-gray-400 font-mono tabular-nums hidden lg:block">
          {currentTime} UTC
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowRoleSwitcher(false); }}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Mark all read
                  </button>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 10).map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer flex gap-3 ${
                      !n.read ? 'bg-gray-800/30' : ''
                    }`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <span className={`text-xs mt-0.5 ${notifTypeColor[n.type]}`}>●</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${n.read ? 'text-gray-400' : 'text-gray-200'} leading-snug`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {!n.read && <Check className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => { setShowRoleSwitcher(!showRoleSwitcher); setShowNotifications(false); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 hover:border-gray-600 transition-all"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {role[0]}
            </div>
            <span className="hidden md:block">{role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setShowRoleSwitcher(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-all first:rounded-t-xl last:rounded-b-xl ${
                    role === r ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
