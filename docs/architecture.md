# IncidentPilot AI - System Architecture

## Architectural Overview

IncidentPilot AI is an AI-powered incident investigation and human-in-the-loop remediation platform for AWS serverless and cloud environments. It accelerates Mean Time to Resolution (MTTR) by collecting metrics, logs, deployments, and traces, performing multi-agent Root Cause Analysis (RCA), and proposing safe, human-approved remediations.

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

## AI Agent Workflow (LangGraph Engine)

IncidentPilot AI employs a multi-agent supervisor pattern using LangGraph:

```
                         ┌───────────────────┐
                         │ Supervisor Agent  │
                         └─────────┬─────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Monitoring Agent │─────►│    RCA Agent     │─────►│ Remediation Agent│
└──────────────────┘      └──────────────────┘      └──────────────────┘
  - CloudWatch Metrics      - Temporal correlation    - Safe action design
  - Application Logs        - Confidence scoring      - Risk rating
  - Deployment events       - Evidence aggregation    - Human approval gate
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │   Report Agent   │
                                                    └──────────────────┘
                                                      - Executive Summary
                                                      - Post-mortem Report
```

1. **Supervisor Agent**: Manages execution state, routes tasks between sub-agents, enforces quality gates, and prevents unapproved execution.
2. **Monitoring Agent**: Extracts telemetry from CloudWatch (CPU, Memory, Latency, Error Rates) and correlates logs & deployment timestamps.
3. **RCA Agent**: Performs statistical anomaly mapping, temporal causality inference, confidence calculation, and evidence synthesis.
4. **Remediation Agent**: Formulates precise, non-destructive remediation proposals with mandatory human approval flags.
5. **Report Agent**: Generates structured Markdown post-mortems exportable for SRE teams.

## Serverless Infrastructure Design

The architecture is built for serverless scale and cost optimization:
- **Hosting**: React SPA hosted in S3 and served securely globally via CloudFront.
- **Backend API**: Python FastAPI application running inside AWS Lambda with HTTP API Gateway.
- **Data Persistence**: Amazon DynamoDB single-table design or scoped multi-table setup (`Incidents`, `IncidentEvents`, `Investigations`, `Reports`) with pay-per-request capacity.
- **AI Reasoning**: Amazon Bedrock (`anthropic.claude-3-haiku` / `anthropic.claude-3-5-sonnet`) invoked securely via boto3.
- **Event Pipeline**: CloudWatch Alarms & EventBridge rules route infrastructure alerts directly to Lambda for automated investigation triggering.
- **Authentication**: Amazon Cognito User Pools for secure auth with JWT validation.
