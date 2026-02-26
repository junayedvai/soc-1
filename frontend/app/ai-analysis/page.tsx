'use client';
import { useState, useCallback } from 'react';
import { Brain, Upload, Play, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface ParsedEvent {
  id: string;
  timestamp: string;
  raw: string;
  level: string;
  parsed: Record<string, string>;
}

interface Anomaly {
  type: string;
  description: string;
  severity: string;
}

const SAMPLE_LOG = `2024-01-15T08:23:11Z ERROR Failed login attempt from 185.220.101.45 for user admin
2024-01-15T08:23:12Z ERROR Failed login attempt from 185.220.101.45 for user root
2024-01-15T08:23:13Z ERROR Failed login attempt from 185.220.101.45 for user admin
2024-01-15T08:24:01Z WARNING POST /api/login HTTP/1.1 401 185.220.101.45
2024-01-15T08:24:15Z INFO GET /dashboard HTTP/1.1 200 10.0.1.5
2024-01-15T08:25:00Z ERROR SQL error: syntax error near 'OR 1=1' from 45.33.32.156
2024-01-15T08:25:01Z ERROR SQL error: UNION SELECT from 45.33.32.156
2024-01-15T08:25:02Z WARNING GET /api/users?id=1 OR 1=1 HTTP/1.1 500 45.33.32.156
2024-01-15T08:26:00Z INFO User jsmith logged in successfully from 10.0.2.45
2024-01-15T08:26:30Z ERROR Connection timeout from 103.224.182.0
2024-01-15T08:27:00Z WARNING Large file download detected: 2.3GB to 103.224.182.0
2024-01-15T08:28:00Z INFO Backup completed successfully
2024-01-15T08:29:00Z ERROR Service auth-service crashed unexpectedly
2024-01-15T08:29:01Z ERROR Service auth-service restart failed`;

function parseLogLine(line: string): Record<string, string> {
  const result: Record<string, string> = {};
  const ipMatch = line.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
  if (ipMatch) result.ip = ipMatch[0];
  const timeMatch = line.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/);
  if (timeMatch) result.timestamp = timeMatch[0];
  const methodMatch = line.match(/(GET|POST|PUT|DELETE|PATCH)\s+(\S+)/);
  if (methodMatch) {
    result.method = methodMatch[1];
    result.path = methodMatch[2];
  }
  const statusMatch = line.match(/\b([2-5]\d{2})\b/);
  if (statusMatch) result.status_code = statusMatch[1];
  return result;
}

function detectAnomalies(events: ParsedEvent[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const errorCount = events.filter(e => e.level === 'ERROR').length;
  if (errorCount > 3) {
    anomalies.push({ type: 'High Error Rate', description: `${errorCount} errors detected in log sample`, severity: 'High' });
  }
  const ips = events.map(e => e.parsed.ip).filter(Boolean);
  const uniqueIps = new Set(ips);
  if (uniqueIps.size > 3) {
    anomalies.push({ type: 'Multiple Source IPs', description: `${uniqueIps.size} unique IPs detected`, severity: 'Medium' });
  }
  const errorCodes = events.filter(e => {
    const code = e.parsed.status_code;
    return code && (code.startsWith('4') || code.startsWith('5'));
  });
  if (errorCodes.length > 2) {
    anomalies.push({ type: 'HTTP Error Storm', description: `${errorCodes.length} HTTP error responses detected`, severity: 'High' });
  }
  const hasSQL = events.some(e => e.raw.toLowerCase().includes('sql') || e.raw.includes('OR 1=1') || e.raw.includes('UNION'));
  if (hasSQL) {
    anomalies.push({ type: 'SQL Injection Pattern', description: 'SQL injection indicators found in log data', severity: 'Critical' });
  }
  return anomalies;
}

function generateSummary(events: ParsedEvent[]): string {
  const errorCount = events.filter(e => e.level === 'ERROR').length;
  const warnCount = events.filter(e => e.level === 'WARNING').length;
  const ips = [...new Set(events.map(e => e.parsed.ip).filter(Boolean))];
  let summary = `AegisX AI Analysis: Processed ${events.length} log events. Found ${errorCount} errors and ${warnCount} warnings. `;
  if (ips.length > 0) {
    summary += `Detected ${ips.length} unique source IPs: ${ips.slice(0, 3).join(', ')}${ips.length > 3 ? '...' : ''}. `;
  }
  if (errorCount / events.length > 0.3) {
    summary += 'HIGH RISK: Error rate exceeds 30% threshold. Possible service disruption or active attack in progress. Immediate investigation recommended.';
  } else if (errorCount / events.length > 0.1) {
    summary += 'MEDIUM RISK: Elevated error rate detected. Review recommended.';
  } else {
    summary += 'LOW RISK: Normal operational patterns detected with some anomalies noted.';
  }
  return summary;
}

const levelColors: Record<string, string> = {
  ERROR: 'text-red-400 bg-red-500/10 border-red-500/30',
  WARNING: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  INFO: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

const anomalySeverityColors: Record<string, string> = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

export default function AIAnalysisPage() {
  const [logText, setLogText] = useState('');
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processLogs = (text: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const lines = text.trim().split('\n').filter(l => l.trim());
      const parsed: ParsedEvent[] = lines.slice(0, 100).map((line, i) => ({
        id: `LOG-${String(i + 1).padStart(4, '0')}`,
        timestamp: new Date().toISOString(),
        raw: line,
        level: /error|fail/i.test(line) ? 'ERROR' : /warn/i.test(line) ? 'WARNING' : 'INFO',
        parsed: parseLogLine(line),
      }));
      setEvents(parsed);
      setAnomalies(detectAnomalies(parsed));
      setAiSummary(generateSummary(parsed));
      setIsProcessing(false);
    }, 800);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const text = ev.target?.result as string;
        setLogText(text);
        processLogs(text);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const text = ev.target?.result as string;
        setLogText(text);
        processLogs(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Brain className="w-6 h-6 text-cyan-400" />
          AI Log Analysis Engine
        </h1>
        <p className="text-gray-400 text-sm mt-1">Machine learning powered log parsing, anomaly detection, and threat analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
            }`}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-medium">Drop log file here</p>
            <p className="text-xs text-gray-500 mt-1">or</p>
            <label className="mt-2 inline-block cursor-pointer">
              <span className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700 transition-all">
                Browse File
              </span>
              <input type="file" className="hidden" accept=".log,.txt,.json" onChange={handleFileInput} />
            </label>
          </div>

          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Paste Log Data
              </label>
              <button
                onClick={() => setLogText(SAMPLE_LOG)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Load sample
              </button>
            </div>
            <textarea
              value={logText}
              onChange={e => setLogText(e.target.value)}
              rows={12}
              placeholder="Paste your log data here..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <button
            onClick={() => processLogs(logText)}
            disabled={!logText.trim() || isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Analyze Logs
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {aiSummary && (
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">AI Summary</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{aiSummary}</p>
            </div>
          )}

          {anomalies.length > 0 && (
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                Detected Anomalies ({anomalies.length})
              </h3>
              <div className="space-y-2">
                {anomalies.map((anomaly, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${anomalySeverityColors[anomaly.severity]}`}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{anomaly.type}</p>
                      <p className="text-xs opacity-80 mt-0.5">{anomaly.description}</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold flex-shrink-0">{anomaly.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {events.length > 0 && (
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  Parsed Events ({events.length})
                </h3>
              </div>
              <div className="overflow-y-auto max-h-72">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-800/90">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-400 font-medium">ID</th>
                      <th className="px-3 py-2 text-left text-gray-400 font-medium">Level</th>
                      <th className="px-3 py-2 text-left text-gray-400 font-medium">Message</th>
                      <th className="px-3 py-2 text-left text-gray-400 font-medium hidden md:table-cell">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-gray-800/30">
                        <td className="px-3 py-2 font-mono text-gray-500">{event.id}</td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded border text-xs font-semibold ${levelColors[event.level]}`}>
                            {event.level}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-300 max-w-[200px] truncate">{event.raw}</td>
                        <td className="px-3 py-2 font-mono text-gray-400 hidden md:table-cell">{event.parsed.ip || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {events.length === 0 && !isProcessing && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500">
              <Brain className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Upload or paste log data to begin analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
