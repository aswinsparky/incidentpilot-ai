#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { AuthStack } from '../lib/auth-stack';
import { BackendStack } from '../lib/backend-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID || '123456789012',
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

const databaseStack = new DatabaseStack(app, 'IncidentPilot-DatabaseStack', { env });

const authStack = new AuthStack(app, 'IncidentPilot-AuthStack', { env });

const backendStack = new BackendStack(app, 'IncidentPilot-BackendStack', {
  env,
  incidentsTable: databaseStack.incidentsTable,
  eventsTable: databaseStack.eventsTable,
  investigationsTable: databaseStack.investigationsTable,
  reportsTable: databaseStack.reportsTable,
});
backendStack.addDependency(databaseStack);

const frontendStack = new FrontendStack(app, 'IncidentPilot-FrontendStack', { env });
frontendStack.addDependency(backendStack);
