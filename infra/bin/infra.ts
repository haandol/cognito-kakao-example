#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayStack } from '../lib/stacks/apigateway-stack'
import { AuthStack } from '../lib/stacks/auth-stack'
import { AuthKakaoStack } from '../lib/stacks/auth-kakao-stack'
import { App, Stack } from '../lib/interfaces/config'

const ns = App.Context.ns
const app = new cdk.App({ context: App.Context })

const authStack = new AuthStack(app, `${ns}AuthStack`, {
  ...Stack.Props,
})

const apiGatewayStack = new ApiGatewayStack(app, `${ns}ApiGatewayStack`, {
  ...Stack.Props,
  userPoolId: authStack.userPool.userPoolId,
  userPoolClientId: authStack.userPoolClient.userPoolClientId,
})
apiGatewayStack.addDependency(authStack)

const authKakaoStack = new AuthKakaoStack(app, `${ns}AuthKakaoStack`, {
  ...Stack.Props,
  api: apiGatewayStack.api,
  authorizerId: apiGatewayStack.requestAuthorizerId,
  userPoolId: authStack.userPool.userPoolId,
  userPoolClientId: authStack.userPoolClient.userPoolClientId,
})
authKakaoStack.addDependency(authStack)
authKakaoStack.addDependency(apiGatewayStack)