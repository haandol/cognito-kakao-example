import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

interface RouteProps {
  api: apigwv2.IHttpApi;
  authorizer?: apigwv2.IHttpRouteAuthorizer;
  routeId: string;
  path: string;
  method: apigwv2.HttpMethod;
  handler: lambda.IFunction;
}

export abstract class BaseApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  protected addRoute(props: RouteProps) {
    const integration = new integrations.HttpLambdaIntegration(
      `${props.routeId}Integration`,
      props.handler
    );
    new apigwv2.HttpRoute(this, `${props.routeId}Route`, {
      httpApi: props.api,
      routeKey: apigwv2.HttpRouteKey.with(props.path, props.method),
      authorizer: props.authorizer,
      integration,
    });
  }
}
