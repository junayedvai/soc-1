# AegisX — Enterprise SOC Platform

**AegisX** is a production-ready Security Operations Center (SOC) platform built with Next.js 16 (frontend) and FastAPI (backend). It provides real-time threat monitoring, incident response orchestration, compliance management, and AI-powered log analysis.

---

## Architecture

```
aegisx/
├── frontend/        # Next.js 16 + TypeScript + TailwindCSS v4
│   ├── app/         # App Router pages
│   │   ├── dashboard/       # Main SOC dashboard
│   │   ├── alerts/          # Alert management
│   │   ├── incidents/        # Incident response + playbooks
│   │   ├── threat-landscape/ # Threat intelligence + MITRE ATT&CK
│   │   ├── compliance/       # Multi-framework compliance
│   │   ├── executive/        # Executive command center
│   │   └── ai-analysis/     # AI log analysis engine
│   ├── components/  # Reusable UI components
│   └── lib/         # Types, mock data, Zustand store
└── backend/         # FastAPI REST API
    └── main.py
```

---

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | KPI cards, severity trends, response time charts |
| **Alert Management** | 16 mock alerts, filter/sort/triage, MITRE ATT&CK mapping, AI summaries |
| **Incident Response** | Automated playbooks, step-by-step orchestration, status tracking |
| **Threat Landscape** | IOC feed, geographic threat origins, MITRE ATT&CK coverage matrix |
| **Compliance** | SOC 2, ISO 27001, NIST CSF, PCI DSS, GDPR, Basel III tracking with risk heatmap |
| **Executive View** | Security posture gauge, risk trends, cost metrics, C-suite reporting |
| **AI Log Analysis** | Drag-and-drop log upload, anomaly detection, AI summary generation |

---

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic python-multipart
uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/alerts` | List alerts |
| POST | `/api/alerts/generate` | Create alert |
| GET | `/api/incidents` | List incidents |
| POST | `/api/incidents` | Create incident |
| GET | `/api/compliance` | Compliance frameworks |
| POST | `/api/logs/parse` | Parse log text |
| POST | `/api/logs/upload` | Upload log file |
| GET | `/api/ai/summary/{alert_id}` | AI alert summary |

Interactive API docs available at `http://localhost:8000/docs`.

---

## Tech Stack

**Frontend:**
- Next.js 16.1.6 (App Router, Turbopack)
- TypeScript
- TailwindCSS v4
- Zustand (state management)
- Recharts (data visualization)
- Lucide React (icons)
- Radix UI (accessible components)

**Backend:**
- Python 3.x
- FastAPI
- Pydantic v2
- Uvicorn

---

## Role-Based Access

Switch roles in the top bar to see different views:

| Role | Access |
|------|--------|
| **SOC Analyst** | Dashboard, Alerts, Incidents, Threat Landscape, AI Analysis |
| **CISO** | All + Compliance, Executive View |
| **Executive** | Dashboard, Threat Landscape, Compliance, Executive View |

---

## Build

```bash
cd frontend && npm run build
```

Produces optimized static output for all 8 routes.
