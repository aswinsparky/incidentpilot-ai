# IncidentPilot AI - AWS Services & Integration Matrix

## Overview
IncidentPilot AI integrates deeply across 9 core AWS services to deliver an enterprise-grade SRE incident response platform.

## AWS Integration Details

### 1. AWS Lambda
- **Role**: Serverless Compute Engine
- **Implementation**: Runs FastAPI backend app wrapped with `mangum` adapter for API Gateway execution. Serves REST endpoints and event handlers.
- **Key Benefit**: Sub-second startup, zero cost at rest, auto-scaling.

### 2. Amazon API Gateway
- **Role**: HTTP API Routing & Throttling
- **Implementation**: Routes HTTP requests from CloudFront to AWS Lambda function. Handles CORS preflight and request payload validation.

### 3. Amazon DynamoDB
- **Role**: Operational Incident Datastore
- **Tables**:
  - `Incidents`: Stores metadata, severity, status, timestamps, service tags, confidence rating, root cause.
  - `IncidentEvents`: Visual timeline events (alerts, metrics anomalies, deployments, agent steps).
  - `Investigations`: AI agent graph state, collected evidence items, candidate root causes.
  - `Reports`: Generated executive post-mortems in Markdown format.

### 4. Amazon S3 & CloudFront
- **Role**: Web SPA Hosting & Edge Delivery
- **Implementation**: Vite-compiled React SPA bundle uploaded to S3 bucket. CloudFront distribution serves frontend over HTTPS with global caching.

### 5. Amazon CloudWatch
- **Role**: System Telemetry & Alarms
- **Implementation**: Ingests CPU utilization, memory, HTTP 5xx error rates, API latency, and application log streams. Alarms push trigger notifications to EventBridge.

### 6. Amazon EventBridge
- **Role**: Event-Driven Orchestration
- **Implementation**: Rules catch CloudWatch Alarms or deployment events and route them to Lambda to trigger automatic AI investigations.

### 7. Amazon Bedrock
- **Role**: AI Reasoning Engine
- **Implementation**: Used by LangGraph RCA and Remediation agents (`anthropic.claude-3-haiku-20240307-v1:0`) to perform deep contextual log analysis, anomaly correlation, and post-mortem generation.

### 8. Amazon Cognito
- **Role**: Identity & Access Management
- **Implementation**: User Pools manage SRE user accounts, MFA, login sessions, and JWT token issuance.

### 9. AWS IAM
- **Role**: Granular Security Policy Enforcement
- **Implementation**: Defines strict execution roles for Lambda, limiting access to specified DynamoDB tables and CloudWatch log groups.
