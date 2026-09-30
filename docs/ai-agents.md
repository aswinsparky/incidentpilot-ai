# IncidentPilot AI - Multi-Agent AI Architecture (LangGraph + Bedrock)

## Overview
IncidentPilot AI replaces unstructured, black-box AI chats with a deterministic **Multi-Agent State Graph** powered by **LangGraph** and **Amazon Bedrock**. The multi-agent workflow ensures structured evidence collection, temporal causality correlation, risk-weighted remediation generation, and post-mortem creation.

## Multi-Agent Graph Structure

```
                  ┌───────────────────────────────┐
                  │       Supervisor Agent        │
                  │  (State Router & Gatekeeper)  │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Monitoring Agent │────►│    RCA Agent     │────►│ Remediation Agent│
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Report Agent   │
                         └──────────────────┘
```

## Detailed Agent Breakdown

### 1. Supervisor Agent
- **Goal**: Orchestrates state transitions, checks agent prerequisites, and controls graph termination.
- **State Schema**: Tracks `incident_id`, `current_stage`, `collected_evidence`, `rca_result`, `remediation_proposal`, `approval_status`, `remediation_result`, and `verification_status`.
- **Safety Gate**: Verifies that `rca_result.confidence > 0.60` before allowing the Remediation Agent to run.

### 2. Monitoring Agent
- **Goal**: Telemetry aggregation & anomaly extraction.
- **Functions**:
  - `fetch_cloudwatch_metrics(service, timeframe)`
  - `fetch_application_logs(service, filter_level="ERROR")`
  - `fetch_deployment_history(service)`
- **Output**: Standardized JSON array of `Evidence` objects with anomaly tags (e.g. `latency_surge`, `memory_leak`, `5xx_error_burst`).

### 3. RCA Agent (Root Cause Analysis)
- **Goal**: Temporal correlation and probability assignment.
- **Model**: Amazon Bedrock (`anthropic.claude-3-haiku`).
- **Logic**: Evaluates timestamp sequences (e.g., *Deployment at T-2m -> Memory spike at T-1m -> Latency increase at T-0m*). Calculates confidence score (0.0 to 1.0) and generates alternative hypothetical causes.

### 4. Remediation Agent
- **Goal**: Generates targeted, non-destructive remediation proposals.
- **Rules**:
  - Sets `requires_approval = True` for all infrastructure mutating actions.
  - Classifies risk (`LOW`, `MEDIUM`, `HIGH`).
  - Outlines exact rollback steps or capacity scaling parameters.

### 5. Report Agent
- **Goal**: Synthesizes the full incident lifecycle into a standard post-mortem document.
- **Output**: Executive summary, timeline table, root cause detail, evidence checklist, resolution summary, and preventative action items.
