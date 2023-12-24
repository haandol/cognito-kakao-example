import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpApi } from '../constructs/httpapi';

interface Props extends cdk.StackProps {
  userPoolId: string;
  userPoolClientId: string;
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigwv2.IHttpApi;
  public readonly authorizer: apigwv2.IHttpRouteAuthorizer;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const ns = this.node.tryGetContext('ns') as string;

    const httpApi = new HttpApi(this, `HttpApi`, {
      userPoolId: props.userPoolId,
      userPoolClientId: props.userPoolClientId,
    });
    this.api = httpApi.api;
    this.authorizer = httpApi.authorizer;

    new cdk.CfnOutput(this, `HttpApiUrl`, {
      exportName: `${ns}HttpApiUrl`,
      value: `${httpApi.api.url}` || 'undefined',
    });
  }
}
