# IncidentPilot AI - "From Alert to Resolution"

[![AWS Hackathon](https://img.shields.io/badge/AWS_Zero_to_Shipped-Hackathon_2026-orange.svg)](https://aws.amazon.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org)
[![React 18](https://img.shields.io/badge/React-18-sky.svg)](https://react.dev)
[![AWS CDK](https://img.shields.io/badge/AWS_CDK-v2-yellow.svg)](https://aws.amazon.com/cdk/)

> **Autonomous Cloud Incident Investigation & Human-Approved Remediation Platform for Modern DevOps Teams.**

---

## 🚀 Overview

**IncidentPilot AI** reduces Mean Time to Resolution (MTTR) from hours to minutes by automating the correlate-investigate-remediate workflow for production outages.

When an alert fires, IncidentPilot AI's **LangGraph Multi-Agent Engine** aggregates CloudWatch metrics, application logs, and deployment history, performs probabilistic Root Cause Analysis (RCA), and generates a risk-rated remediation proposal. Crucially, **all destructive actions require explicit human approval** before execution.

```
ALERT  ──►  COLLECT TELEMETRY  ──►  MULTI-AGENT RCA  ──►  HUMAN APPROVAL  ──►  SAFE REMEDIATION  ──►  VERIFIED RECOVERY
```

---

## ✨ Key Features

1. **Deterministic Multi-Agent State Machine**: Powered by LangGraph and Amazon Bedrock (`Supervisor`, `Monitoring`, `RCA`, `Remediation`, and `Report` agents).
2. **Human-in-the-Loop Safety Gate**: Destructive AWS CLI commands are strictly prohibited. Remediations (`rollback_deployment`, `scale_service`, `kill_connections`) require explicit IAM approval.
3. **Real-Time Telemetry Correlation**: Recharts visual charts for Memory, CPU, Latency, and HTTP 5xx error spikes alongside raw CloudWatch log streams.
4. **Deterministic Demo Scenario Generator**: 3 pre-configured production incident scenarios (`Deployment Failure`, `Database Degradation`, `Traffic Spike`) for judge evaluation.
5. **Automated Post-Mortem Generator**: Synthesizes exportable Markdown post-mortems with timeline tables, root cause analysis, evidence lists, and prevention action items.
6. **100% Serverless AWS Architecture**: Built with AWS Lambda, API Gateway, DynamoDB, S3, CloudFront, Cognito, and EventBridge. Cost profile is < $2.00/month.

---

## 🏗️ Architecture

```
                    ┌─────────────────────────┐
                    │       User / SRE        │
                    └────────────┬────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ CloudFront Host (CDN) │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   S3 Static Bucket    │
                     │  (React / Vite Web)   │
                     └───────────┬───────────┘
                                 │ REST / SSE
                                 ▼
                     ┌───────────────────────┐
                     │  Amazon API Gateway   │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ AWS Lambda API Engine │
                     │   (FastAPI / Python)  │
                     └─────┬───────────┬─────┘
                           │           │
           ┌───────────────┴─┐       ┌─┴────────────────┐
           │                 │       │                  │
           ▼                 ▼       ▼                  ▼
     ┌───────────┐    ┌───────────┐ ┌──────────┐ ┌──────────────┐
     │ DynamoDB  │    │ CloudWatch│ │ Event    │ │ Amazon       │
     │  Tables   │    │Logs/Metric│ │ Bridge   │ │ Bedrock      │
     └───────────┘    └───────────┘ └──────────┘ └──────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Uvicorn, Mangum
- **AI Agents**: LangGraph, Amazon Bedrock (`anthropic.claude-3-haiku`)
- **Infrastructure as Code**: AWS CDK (TypeScript)
- **AWS Cloud**: AWS Lambda, API Gateway, DynamoDB, S3, CloudFront, Cognito, CloudWatch, EventBridge

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20+ & npm
- Python 3.12+

### 1. Clone & Run Backend
```bash
cd backend
python -m pip install -r requirements.txt
$env:PYTHONPATH="."  # Windows Powershell
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Testing

Run backend Pytest test suite:
```bash
$env:PYTHONPATH="backend"
python -m pytest backend/tests
```

Build frontend production bundle:
```bash
cd frontend
npm run build
```

Synthesize AWS CDK Infrastructure:
```bash
cd infrastructure
npx cdk synth
```

---

## 📄 Documentation

- [Implementation Plan](docs/implementation-plan.md)
- [Architecture & Workflow](docs/architecture.md)
- [AI Multi-Agent Architecture](docs/ai-agents.md)
- [AWS Services Matrix](docs/aws-services.md)
- [Security & Safety Architecture](docs/security.md)
- [Cost Optimization Strategy](docs/cost-optimization.md)
- [Development Process & Methodology](docs/development-process.md)
- [Coding Agent Evidence Log](docs/coding-agent-evidence.md)
- [Hackathon Submission Guide](docs/hackathon-submission.md)

---

## 📜 License
MIT License. Created for the **AWS Zero to Shipped Hackathon 2026**.
