# IncidentPilot AI - Hackathon Submission & Judging Guide

## Project Details
- **Project Name**: IncidentPilot AI
- **Tagline**: "From Alert to Resolution"
- **Category**: Workplace Efficiency
- **Lane**: Startup
- **Target Audience**: SREs, DevOps Engineers, Cloud Infrastructure Teams

## Hackathon Requirement Fulfillment Checklist

| Requirement | Implementation Detail | Status |
|---|---|---|
| 1. Original Application | Purpose-built AI SRE Incident Response platform designed from scratch | ✅ Complete |
| 2. AWS Cloud Infrastructure | AWS Lambda, API Gateway, DynamoDB, S3, CloudFront, Cognito, Bedrock, EventBridge, CloudWatch | ✅ Complete |
| 3. Public Web URL | Hosted on CloudFront CDN over HTTPS | ✅ Complete |
| 4. Human & Automated Accessibility | Responsive React Web SPA + OpenAPI FastAPI REST endpoints (`/docs`, `/api/health`) | ✅ Complete |
| 5. Technical Innovation | Deterministic Multi-Agent State Graph (LangGraph) replacing unstructured chatbots | ✅ Complete |
| 6. Safety & Security | Enforced Human-in-the-Loop approval gating before any mutation actions | ✅ Complete |
| 7. Cost Optimization | 100% Serverless Pay-per-Use architecture (< $2.00/month estimated cost) | ✅ Complete |
| 8. Development Documentation | Comprehensive architecture, security, cost, agent evidence, and workflow logs | ✅ Complete |

## Quick 3-Minute Demo Walkthrough for Judges

1. **Launch App**: Open IncidentPilot AI dashboard.
2. **Trigger Outage Scenario**: Click **"Simulate Incident"** -> **"Scenario 1: Deployment Failure"**.
3. **Inspect Active Incident**: Observe `INC-1042` created with `HIGH` severity and `ACTIVE` alert badge.
4. **View Telemetry Anomaly**: Inspect metric graphs (Memory spiked to 94%, Latency to 2,800ms, 5xx errors to 18.5%).
5. **Run AI Investigation**: Click **"Start AI Investigation"**. Watch the live multi-agent workflow:
   - *Monitoring Agent*: Gathers CloudWatch metrics & log entries.
   - *RCA Agent*: Calculates 87% root cause confidence for deployment `production-api:v42`.
   - *Remediation Agent*: Proposes safe action `rollback_deployment` to `v41`.
6. **Human Approval**: Click **"Approve Remediation"**. Confirm approver identity (`sre-lead@company.com`).
7. **Verify Recovery**: Automated post-execution telemetry checks confirm memory drops to baseline (59%) and error rate drops to 0.1%. Status turns `RESOLVED`.
8. **Export Post-Mortem**: Click **"Post-Mortem Report"** to view and print executive summary.
