from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import re
from datetime import datetime
import uuid

app = FastAPI(title="AegisX SOC API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models ---
class LogParseRequest(BaseModel):
    log_text: str


class AlertCreate(BaseModel):
    title: str
    severity: str
    source: str
    description: str
    affected_host: str
    source_ip: str


class IncidentCreate(BaseModel):
    title: str
    severity: str
    alert_ids: List[str]


# --- Mock Data ---
MOCK_ALERTS: list = [
    {"id": "ALT-001", "title": "Brute Force Attack", "severity": "Critical", "status": "New", "source": "Firewall", "timestamp": "2024-01-15T08:23:11Z"},
    {"id": "ALT-002", "title": "Ransomware Detected", "severity": "Critical", "status": "Investigating", "source": "EDR", "timestamp": "2024-01-15T07:45:00Z"},
    {"id": "ALT-003", "title": "Data Exfiltration", "severity": "High", "status": "Acknowledged", "source": "DLP", "timestamp": "2024-01-15T06:12:33Z"},
]

MOCK_INCIDENTS: list = [
    {"id": "INC-001", "title": "Active Ransomware Outbreak", "severity": "Critical", "status": "Active", "alert_ids": ["ALT-002"]},
    {"id": "INC-002", "title": "Data Exfiltration Campaign", "severity": "High", "status": "Investigating", "alert_ids": ["ALT-003"]},
]

AI_SUMMARIES: dict = {
    "ALT-001": "High-confidence brute force attack targeting SSH. Pattern matches known Mirai botnet behavior. Recommend immediate IP block and MFA enforcement.",
    "ALT-002": "Ransomware behavior confirmed. File encryption rate of 200 files/min. Lateral movement indicators present. IMMEDIATE ISOLATION REQUIRED.",
    "ALT-003": "Potential data exfiltration via HTTPS. Destination IP maps to cloud storage in unrecognized country. Behavioral anomaly score: 94/100.",
}


# --- Endpoints ---
@app.get("/")
def root():
    return {"name": "AegisX SOC API", "version": "1.0.0", "status": "operational"}


@app.get("/api/alerts")
def get_alerts():
    return {"alerts": MOCK_ALERTS, "total": len(MOCK_ALERTS)}


@app.post("/api/alerts/generate")
def generate_alert(alert: AlertCreate):
    new_alert = {
        "id": f"ALT-{uuid.uuid4().hex[:6].upper()}",
        "title": alert.title,
        "severity": alert.severity,
        "status": "New",
        "source": alert.source,
        "description": alert.description,
        "affectedHost": alert.affected_host,
        "sourceIP": alert.source_ip,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    MOCK_ALERTS.append(new_alert)
    return new_alert


@app.get("/api/incidents")
def get_incidents():
    return {"incidents": MOCK_INCIDENTS, "total": len(MOCK_INCIDENTS)}


@app.post("/api/incidents")
def create_incident(incident: IncidentCreate):
    new_incident = {
        "id": f"INC-{uuid.uuid4().hex[:6].upper()}",
        "title": incident.title,
        "severity": incident.severity,
        "status": "Active",
        "alert_ids": incident.alert_ids,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    MOCK_INCIDENTS.append(new_incident)
    return new_incident


@app.get("/api/compliance")
def get_compliance():
    return {
        "frameworks": [
            {"name": "SOC 2 Type II", "coverage": 94, "controls": 64, "passed": 60, "risk": "Low"},
            {"name": "ISO 27001", "coverage": 89, "controls": 114, "passed": 101, "risk": "Low"},
            {"name": "NIST CSF", "coverage": 82, "controls": 108, "passed": 89, "risk": "Medium"},
            {"name": "PCI DSS v4", "coverage": 76, "controls": 300, "passed": 228, "risk": "Medium"},
            {"name": "GDPR", "coverage": 91, "controls": 99, "passed": 90, "risk": "Low"},
            {"name": "Basel III", "coverage": 71, "controls": 85, "passed": 60, "risk": "High"},
        ]
    }


@app.post("/api/logs/upload")
async def upload_log(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    lines = text.strip().split("\n")
    events = []
    for i, line in enumerate(lines[:100]):
        if line.strip():
            events.append({
                "id": f"LOG-{i+1:04d}",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "raw": line,
                "level": (
                    "ERROR" if re.search(r"error|fail", line, re.IGNORECASE) else
                    "WARNING" if re.search(r"warn", line, re.IGNORECASE) else "INFO"
                ),
                "parsed": parse_log_line(line),
            })
    anomalies = detect_anomalies(events)
    return {"events": events[:50], "total": len(events), "anomalies": anomalies}


@app.post("/api/logs/parse")
def parse_logs(request: LogParseRequest):
    lines = request.log_text.strip().split("\n")
    events = []
    for i, line in enumerate(lines[:100]):
        if line.strip():
            events.append({
                "id": f"LOG-{i+1:04d}",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "raw": line,
                "level": (
                    "ERROR" if re.search(r"error|fail", line, re.IGNORECASE) else
                    "WARNING" if re.search(r"warn", line, re.IGNORECASE) else "INFO"
                ),
                "parsed": parse_log_line(line),
            })
    anomalies = detect_anomalies(events)
    ai_summary = generate_ai_summary(events)
    return {"events": events[:50], "total": len(events), "anomalies": anomalies, "ai_summary": ai_summary}


@app.get("/api/ai/summary/{alert_id}")
def get_ai_summary(alert_id: str):
    summary = AI_SUMMARIES.get(
        alert_id,
        f"AI analysis for {alert_id}: Analyzing behavioral patterns and threat intelligence data. No immediate critical indicators found. Continue monitoring recommended.",
    )
    return {"alert_id": alert_id, "summary": summary, "confidence": 0.87, "model": "AegisX-AI-v2"}


def parse_log_line(line: str) -> dict:
    result: dict = {}
    ip_match = re.search(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", line)
    if ip_match:
        result["ip"] = ip_match.group()
    time_match = re.search(r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}", line)
    if time_match:
        result["timestamp"] = time_match.group()
    method_match = re.search(r"(GET|POST|PUT|DELETE|PATCH)\s+(\S+)", line)
    if method_match:
        result["method"] = method_match.group(1)
        result["path"] = method_match.group(2)
    status_match = re.search(r"\b([2-5]\d{2})\b", line)
    if status_match:
        result["status_code"] = status_match.group()
    return result


def detect_anomalies(events: list) -> list:
    anomalies = []
    error_count = sum(1 for e in events if e.get("level") == "ERROR")
    if error_count > 5:
        anomalies.append({"type": "High Error Rate", "description": f"{error_count} errors detected", "severity": "High"})
    ips = [e["parsed"].get("ip") for e in events if e.get("parsed", {}).get("ip")]
    unique_ips = set(ips)
    if len(unique_ips) > 10:
        anomalies.append({"type": "Multiple Source IPs", "description": f"{len(unique_ips)} unique IPs detected", "severity": "Medium"})
    status_codes = [e["parsed"].get("status_code") for e in events if e.get("parsed", {}).get("status_code")]
    error_codes = [c for c in status_codes if c and c[0] in ("4", "5")]
    if len(error_codes) > 10:
        anomalies.append({"type": "HTTP Error Storm", "description": f"{len(error_codes)} HTTP errors detected", "severity": "High"})
    return anomalies


def generate_ai_summary(events: list) -> str:
    error_count = sum(1 for e in events if e.get("level") == "ERROR")
    warn_count = sum(1 for e in events if e.get("level") == "WARNING")
    total = len(events)
    ips = list(set(e["parsed"].get("ip") for e in events if e.get("parsed", {}).get("ip")))
    summary = f"AegisX AI Analysis: Processed {total} log events. "
    summary += f"Found {error_count} errors and {warn_count} warnings. "
    if ips:
        top_ips = ips[:3]
        suffix = "..." if len(ips) > 3 else ""
        summary += f"Detected {len(ips)} unique source IPs: {', '.join(top_ips)}{suffix}. "
    if total > 0 and error_count / total > 0.3:
        summary += "HIGH RISK: Error rate exceeds 30% threshold. Possible service disruption or attack in progress. "
    elif total > 0 and error_count / total > 0.1:
        summary += "MEDIUM RISK: Elevated error rate detected. Investigation recommended. "
    else:
        summary += "LOW RISK: Normal operational patterns detected. "
    return summary
