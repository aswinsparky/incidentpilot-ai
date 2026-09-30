import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly incidentsTable: dynamodb.Table;
  public readonly eventsTable: dynamodb.Table;
  public readonly investigationsTable: dynamodb.Table;
  public readonly reportsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Incidents Table
    this.incidentsTable = new dynamodb.Table(this, 'IncidentsTable', {
      tableName: 'IncidentPilot-Incidents',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Incident Events Timeline Table
    this.eventsTable = new dynamodb.Table(this, 'EventsTable', {
      tableName: 'IncidentPilot-Events',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // AI Investigations State Table
    this.investigationsTable = new dynamodb.Table(this, 'InvestigationsTable', {
      tableName: 'IncidentPilot-Investigations',
      partitionKey: { name: 'incident_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Incident Reports Table
    this.reportsTable = new dynamodb.Table(this, 'ReportsTable', {
      tableName: 'IncidentPilot-Reports',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
