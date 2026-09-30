# IncidentPilot AI - Development Process & Methodology

## Overview
This document logs the step-by-step development process of **IncidentPilot AI** for the AWS Zero to Shipped Hackathon. It details architectural decisions, phase transitions, testing milestones, and AI coding agent collaboration.

## Development Methodology & Strategy
To build a production-grade, highly reliable cloud incident investigation platform within hackathon timelines, we followed an iterative, test-driven serverless architecture:

1. **Dual Cloud Abstraction**: Created a `CloudService` abstraction enabling smooth switching between local simulated cloud telemetry (`MockCloudService`) and live AWS resources (`AWSCloudService`).
2. **Explainable Multi-Agent AI**: Built specialized LangGraph state-graph agents instead of generic black-box chatbots.
3. **Safety-First Remediation**: Enforced hard human-in-the-loop approval gates before any infrastructure changes are triggered.
4. **Full Infrastructure as Code**: Used AWS CDK (TypeScript) for reproducible deployment.

## Key Phases Executed

### Phase 1: Planning & Specification
- Mapped end-to-end incident lifecycle: Alert → Detect → Evidence Collection → Multi-agent RCA → Human Approval → Safe Remediation → Recovery Verification → Post-Mortem.
- Designed DynamoDB schemas, API OpenAPI contracts, and frontend design system.

### Phase 2: Mock & Live Cloud Services
- Built high-fidelity mock generators for 3 core production outage scenarios:
  1. *Deployment Failure*: Memory leakage post-release causing 5xx cascading errors.
  2. *Database Bottleneck*: Connection pool exhaustion and query latency surge.
  3. *Traffic Spike*: Sudden load surge overwhelming compute capacity.

### Phase 3: AI Agent State Graph (LangGraph + Bedrock)
- Engineered structured prompt schemas with fallback parsers for deterministic output.
- Configured Amazon Bedrock invocation with automatic parameter fallback for local & cloud runtime safety.

### Phase 4: Modern React SaaS Frontend
- Created responsive dark/light SRE dashboard with real-time SSE stream support for AI reasoning visualization.
- Built interactive metric anomaly charts (Recharts), log filters, visual timelines, and post-mortem export buttons.

### Phase 5: Testing & Verification
- Unit and API test suites created for FastAPI backend routes, agent workflows, and CloudService models.
- Verification of recovery flows and approval gating.

### Phase 6: AWS CDK Deployment
- Provisioned DynamoDB tables, Lambda function, API Gateway HTTP API, S3 bucket, CloudFront distribution, and Cognito Auth user pools.
