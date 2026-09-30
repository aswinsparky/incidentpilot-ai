# IncidentPilot AI - Cost Optimization & Serverless Strategy

## Cost Architecture Principles
IncidentPilot AI is designed specifically for **maximum cost efficiency** by leveraging 100% serverless, pay-per-use AWS services. Idle infrastructure expenses (such as running EC2 instances, EKS clusters, NAT Gateways, or RDS instances) are completely eliminated.

## AWS Services & Cost Profile

| AWS Service | Usage Pattern | Cost Impact |
|---|---|---|
| **AWS Lambda** | Event-driven backend execution (FastAPI application) | \$0 when idle (1M free requests/month, then \$0.20 per 1M requests) |
| **Amazon API Gateway** | HTTP API endpoint routing | Pay-per-request (~ \$1.00 per million requests) |
| **Amazon DynamoDB** | On-Demand billing model for incident data | Pay per read/write request unit (~ \$0.25 per million write units) |
| **Amazon S3** | Static web hosting asset storage | Tiny footprint (< 50MB, cents/month) |
| **Amazon CloudFront** | CDN caching for static frontend SPA | Free tier includes 1TB data transfer out per month |
| **Amazon Bedrock** | Pay-per-token model for AI reasoning | ~ \$0.00025 per investigation using Claude 3 Haiku / 3.5 Sonnet |
| **CloudWatch Logs** | Incident telemetry logging with 7-day retention | Free tier covers 5GB ingestion; 7-day retention policy avoids storage build-up |

## Development & Demo Cost Protection
1. **Mock Cloud Environment**: During development and local UI testing, the application runs using `USE_MOCK_DATA=true`. Zero AWS charges are incurred.
2. **CloudWatch Log Retention**: Log groups configured via CDK explicitly set `retention: RetentionDays.ONE_WEEK` to prevent runaway storage costs.
3. **Lambda Memory Optimization**: Lambda function sized at 512MB memory for rapid execution (< 500ms response times) while minimizing gigabyte-second cost metrics.
4. **No NAT Gateway**: Lambda runs outside VPC or uses VPC endpoints where necessary, avoiding fixed ~\$30/month NAT Gateway charges.

## Estimated Monthly Cost (Hackathon / Demo Load)
- Total projected AWS monthly cost under active hackathon evaluation: **< \$2.00 / month**.
