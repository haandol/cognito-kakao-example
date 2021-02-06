import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations'

interface RouteProps {
  api: apigwv2.IHttpApi
  authorizerType?: 'JWT' | 'AWS_IAM'
  authorizerId?: string
  routeId: string
  path: string
  method: apigwv2.HttpMethod
  handler: lambda.IFunction
}

export abstract class BaseApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }

  protected addRoute(props: RouteProps) {
    if (props.authorizerType === 'JWT' && props.authorizerId === undefined) {
      throw Error('JWT authorizer requires authorizerId')
    } else if (props.authorizerType === 'AWS_IAM' && props.authorizerId !== undefined) {
      throw Error('IAM authorizer can not be configured with authorizerId')
    }

    const integration = new integrations.LambdaProxyIntegration({ handler: props.handler })
    const route = new apigwv2.HttpRoute(this, `${props.routeId}Route`, {
      httpApi: props.api,
      routeKey: apigwv2.HttpRouteKey.with(props.path, props.method),
      integration,
    })
    const routeCfn = route.node.defaultChild as apigwv2.CfnRoute
    routeCfn.authorizationType = props.authorizerType
    routeCfn.authorizerId = props.authorizerId
  }
}