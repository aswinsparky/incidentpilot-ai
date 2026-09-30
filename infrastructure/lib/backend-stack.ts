import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface BackendStackProps extends cdk.StackProps {
  incidentsTable: dynamodb.Table;
  eventsTable: dynamodb.Table;
  investigationsTable: dynamodb.Table;
  reportsTable: dynamodb.Table;
}

export class BackendStack extends cdk.Stack {
  public readonly httpApi: apigw.HttpApi;
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    // Lambda execution role with Bedrock & CloudWatch permissions
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess'),
      ],
    });

    // Bedrock Invocation Policy
    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
        resources: ['*'],
      })
    );

    // Grant DynamoDB Table Access
    props.incidentsTable.grantReadWriteData(lambdaRole);
    props.eventsTable.grantReadWriteData(lambdaRole);
    props.investigationsTable.grantReadWriteData(lambdaRole);
    props.reportsTable.grantReadWriteData(lambdaRole);

    // FastAPI Lambda Function
    this.lambdaFunction = new lambda.Function(this, 'BackendApiFunction', {
      functionName: 'IncidentPilot-BackendAPI',
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'app.main.handler',
      code: lambda.Code.fromAsset('../backend'),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      environment: {
        APP_ENV: 'production',
        USE_MOCK_DATA: 'false',
        USE_AWS: 'true',
        DYNAMODB_INCIDENTS_TABLE: props.incidentsTable.tableName,
        DYNAMODB_EVENTS_TABLE: props.eventsTable.tableName,
        DYNAMODB_INVESTIGATIONS_TABLE: props.investigationsTable.tableName,
        DYNAMODB_REPORTS_TABLE: props.reportsTable.tableName,
        BEDROCK_MODEL_ID: 'anthropic.claude-3-haiku-20240307-v1:0',
      },
    });

    // API Gateway HTTP API
    this.httpApi = new apigw.HttpApi(this, 'IncidentPilotHttpApi', {
      apiName: 'IncidentPilot API',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigw.CorsHttpMethod.GET, apigw.CorsHttpMethod.POST, apigw.CorsHttpMethod.OPTIONS],
        allowHeaders: ['*'],
      },
    });

    const integration = new integrations.HttpLambdaIntegration('LambdaIntegration', this.lambdaFunction);

    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigw.HttpMethod.ANY],
      integration: integration,
    });

    new cdk.CfnOutput(this, 'ApiEndpointUrl', {
      value: this.httpApi.apiEndpoint,
    });
  }
}
