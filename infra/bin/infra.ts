#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/stacks/apigateway-stack';
import { AuthStack } from '../lib/stacks/auth-stack';
import { AuthKakaoStack } from '../lib/stacks/auth-kakao-stack';
import { Config } from '../config/loader';

const app = new cdk.App({
  context: {
    ns: Config.app.ns,
    stage: Config.app.stage,
  },
});

const authStack = new AuthStack(app, `${Config.app.ns}AuthStack`, {
  clientId: Config.auth.clientId,
  clientSecret: Config.auth.clientSecret,
  scopes: Config.auth.scopes,
  redirectUris: Config.auth.redirectUris,
});

const apiGatewayStack = new ApiGatewayStack(
  app,
  `${Config.app.ns}ApiGatewayStack`,
  {
    userPoolId: authStack.userPool.userPoolId,
    userPoolClientId: authStack.userPoolClient.userPoolClientId,
  }
);
apiGatewayStack.addDependency(authStack);

const authKakaoStack = new AuthKakaoStack(
  app,
  `${Config.app.ns}AuthKakaoStack`,
  {
    api: apiGatewayStack.api,
    authorizer: apiGatewayStack.authorizer,
    userPoolId: authStack.userPool.userPoolId,
    userPoolClientId: authStack.userPoolClient.userPoolClientId,
  }
);
authKakaoStack.addDependency(authStack);
authKakaoStack.addDependency(apiGatewayStack);
