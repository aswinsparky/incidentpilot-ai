# IncidentPilot AI - Implementation Plan & Roadmap

## Overview
IncidentPilot AI is an AI-powered cloud incident investigation and remediation platform designed for DevOps and SRE teams. It automates evidence collection, root cause analysis, confidence scoring, and human-approved safe remediations.

## Phases & Milestones

### Phase 1: Foundation & Architecture Setup
- [x] Initialize Git repository & standard directory structure
- [x] Create core documentation (`architecture.md`, `security.md`, `cost-optimization.md`, `coding-agent-evidence.md`, `development-process.md`)
- [x] Configure backend environment (FastAPI, Python 3.12+, Pydantic)
- [x] Configure frontend environment (React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons)

### Phase 2: Core Data Models & Mock Cloud Engine
- [x] Define Pydantic schemas for Incident, Event, Evidence, Investigation, Recommendation, Remediation, and Report
- [x] Build CloudService abstraction interface with dual implementation:
  - `MockCloudService`: Realistic simulation of AWS CloudWatch metrics, CloudWatch logs, deployment events, and DynamoDB data.
  - `AWSCloudService`: Real AWS SDK (boto3) integrations for CloudWatch, DynamoDB, Bedrock, S3, EventBridge.
- [x] Create seed data generator for 3 key hackathon demo scenarios:
  1. Deployment Failure (memory leak / regression)
  2. Database Performance Degradation (connection pool & query latency)
  3. Traffic Spike / Load Anomaly (resource saturation)

### Phase 3: LangGraph Agent Orchestration Engine
- [x] Implement multi-agent AI architecture:
  - **Supervisor Agent**: State orchestration, routing, approval gating.
  - **Monitoring Agent**: Anomaly detection, metric & log collection, evidence extraction.
  - **RCA (Root Cause Analysis) Agent**: Correlation analysis, temporal reasoning, confidence calculation.
  - **Remediation Agent**: Safe remediation plan generation with risk level & expected impact.
  - **Report Agent**: Post-incident executive summary & post-mortem generation.
- [x] Bedrock / LLM integration with fallback structured JSON generation for zero-failure reliability.

### Phase 4: FastAPI REST API & SSE Real-time Streaming
- [x] Implement endpoints:
  - `GET /api/health`
  - `GET /api/dashboard/stats`
  - `GET /api/incidents`
  - `POST /api/incidents`
  - `GET /api/incidents/{incident_id}`
  - `POST /api/incidents/{incident_id}/investigate` (with Server-Sent Events SSE live investigation stream)
  - `GET /api/incidents/{incident_id}/investigation`
  - `POST /api/incidents/{incident_id}/approve`
  - `POST /api/incidents/{incident_id}/reject`
  - `POST /api/incidents/{incident_id}/remediate`
  - `GET /api/incidents/{incident_id}/timeline`
  - `POST /api/demo/simulate`
  - `GET /api/reports`
  - `GET /api/reports/{report_id}`
- [x] CORS middleware, JWT auth header stubs, error handling, and structured logging.

### Phase 5: Modern SaaS UI / UX Frontend
- [x] Landing Page with hero section, feature breakdown, live demo launch CTA, and architectural interactive diagrams.
- [x] SRE operational dashboard:
  - Real-time system health summary
  - Key performance metrics cards (MTTR, Active Incidents, Success Rate, Error Rates)
  - Live incident feed with severity badges
  - Quick action "Simulate Incident" trigger
- [x] Deep-dive Incident View:
  - Incident status & timeline (interactive visual timeline from alert to recovery)
  - CloudWatch Metric charts (Recharts) showing CPU, Memory, Latency, Error Rate anomalies
  - Log viewer with log severity filters
  - Live AI investigation stream visualization (step-by-step agent workflow execution indicator)
  - Structured Root Cause Analysis with confidence rating visual gauge
  - Evidence cards with verified observations
  - Human Approval modal for remediation execution
  - Remediation result & automated post-remediation recovery verification indicator
  - Exportable Post-Mortem Incident Report generator

### Phase 6: AWS CDK Infrastructure as Code & Serverless Deployment
- [x] Create AWS CDK TypeScript app with stacks:
  - `DatabaseStack`: DynamoDB tables (`Incidents`, `IncidentEvents`, `Investigations`, `Reports`) with pay-per-request billing.
  - `BackendStack`: AWS Lambda function (Python runtime), API Gateway HTTP API, IAM execution roles.
  - `FrontendStack`: S3 Bucket + CloudFront distribution for SPA web hosting with custom domain / OAI access.
  - `AuthSecurityStack`: Amazon Cognito User Pool + App Client, IAM least-privilege roles.
- [x] Environment variable binding and cross-stack reference outputs.

### Phase 7: Automated Testing & CI/CD Pipeline
- [x] Backend Pytest suite (API route testing, CloudService layer tests, Agent state machine tests, Pydantic validation tests).
- [x] Frontend build & TypeScript checking.
- [x] GitHub Actions workflow configuration (`.github/workflows/ci-cd.yml`).

### Phase 8: Deployment, Verification & Final Polish
- [x] CDK synthesis & deployment to AWS region.
- [x] CloudFront edge distribution verification & live web testing.
- [x] Seed live AWS environment with demo incidents.
- [x] Final README, documentation & hackathon video presentation submission guide.
