# IncidentPilot AI - Security & Safety Architecture

## Core Security Philosophy
IncidentPilot AI adheres to the **Principle of Least Privilege**, strict **Human-in-the-Loop Approval Gating**, and **Zero Unbounded AI Execution**. The system guarantees that AI models analyze evidence and formulate recommendations, but can **NEVER** execute destructive infrastructure mutations without explicit authentication and human authorization.

## Safety Controls & Principles

### 1. Human Approval Gating (Mandatory)
- Remediation actions (`rollback_deployment`, `scale_service`, `restart_service`, `clear_cache`) require explicit POST request approvals from an authenticated user.
- The AI Agent generates a recommendation object containing:
  - Action name & target service
  - Risk rating (`LOW`, `MEDIUM`, `HIGH`)
  - Expected impact description
  - Potential side effects
- Execution is strictly blocked until an authorized human user clicks **Approve Remediation**.

### 2. Bounded AI Tool Calling (No Arbitrary Execution)
- The Bedrock / LangGraph reasoning engine does **NOT** have access to raw shell interpreters, AWS CLI, or arbitrary code execution toolsets.
- All agent interactions with infrastructure occur through statically typed Python functions (`get_metrics`, `get_logs`, `get_deployment_info`, `execute_rollback`).

### 3. Authentication & Authorization
- **Amazon Cognito**: User Pools enforce multi-factor authentication (MFA) and JWT issuing.
- **API Gateway JWT Authorizer**: Validates incoming Authorization tokens before routing requests to Lambda handlers.

### 4. IAM Least Privilege Policies
- Lambda execution roles are granted read-only access to CloudWatch metrics & logs (`cloudwatch:GetMetricData`, `logs:FilterLogEvents`).
- DynamoDB access is restricted strictly to application tables (`Incidents`, `IncidentEvents`, `Investigations`, `Reports`).
- Bedrock invocation permissions (`bedrock:InvokeModel`) are limited to specified model ARNs (`anthropic.claude-3-haiku-20240307-v1:0` or `anthropic.claude-3-5-sonnet`).

### 5. Secrets Management & Data Safety
- No hardcoded access keys, secrets, or API tokens in source code or CDK code.
- Production environment configurations use AWS Systems Manager Parameter Store or Secrets Manager.
- All HTTP communication uses TLS 1.3 encryption in transit (HTTPS API Gateway & CloudFront).
- DynamoDB tables use AWS KMS encryption at rest.
