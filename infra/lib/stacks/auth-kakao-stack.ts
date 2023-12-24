import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { BaseApiStack } from './base-stack';

interface Props extends cdk.StackProps {
  api: apigwv2.IHttpApi;
  authorizer?: apigwv2.IHttpRouteAuthorizer;
  userPoolId: string;
  userPoolClientId: string;
}

export class AuthKakaoStack extends BaseApiStack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const ns = this.node.tryGetContext('ns') as string;

    const checkFunction = this.newCheckFunction(ns);

    this.addRoute({
      api: props.api,
      authorizer: props.authorizer,
      routeId: 'Check',
      path: '/check',
      method: apigwv2.HttpMethod.GET,
      handler: checkFunction,
    });
  }

  private newCheckFunction(ns: string) {
    const fn = new lambdaNodejs.NodejsFunction(this, `Check`, {
      functionName: `${ns}Check`,
      entry: path.resolve(__dirname, '..', 'functions', 'check.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
    });
    return fn;
  }
}
