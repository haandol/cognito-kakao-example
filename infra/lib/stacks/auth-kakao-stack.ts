import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { BaseApiStack } from '../interfaces/base-stack';
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
      routeId: 'AuthKakao',
      path: '/auth/kakao',
      method: apigwv2.HttpMethod.POST,
      handler: kakaoAuth.kakaoAuthFunction,
    });
    this.addRoute({
      api: props.api,
      authorizer: props.authorizer,
      routeId: 'Ping',
      path: '/ping',
      method: apigwv2.HttpMethod.GET,
      handler: kakaoAuth.pingFunction,
    });
  }
}
