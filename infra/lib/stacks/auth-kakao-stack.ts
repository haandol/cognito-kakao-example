import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { BaseApiStack } from './base-stack';
import { KakaoAuth } from '../constructs/kakao';

interface Props extends cdk.StackProps {
  api: apigwv2.IHttpApi;
  authorizer?: apigwv2.IHttpRouteAuthorizer;
  userPoolId: string;
  userPoolClientId: string;
}

export class AuthKakaoStack extends BaseApiStack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const kakaoAuth = new KakaoAuth(this, `KakaoAuth`, {
      userPoolId: props.userPoolId,
      userPoolClientId: props.userPoolClientId,
    });

    this.addRoute({
      api: props.api,
      authorizer: props.authorizer,
      routeId: 'Check',
      path: '/check',
      method: apigwv2.HttpMethod.GET,
      handler: kakaoAuth.checkFunction,
    });
  }
}
