import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations'

interface RouteProps {
  api: apigwv2.IHttpApi
  authorizerId?: string
  routeId: string
  path: string
  method: apigwv2.HttpMethod
  handler: lambda.IFunction
}

export class BaseApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }

  protected addRoute(props: RouteProps) {
    const integration = new integrations.LambdaProxyIntegration({ handler: props.handler })
    const route = new apigwv2.HttpRoute(this, `${props.routeId}Route`, {
      httpApi: props.api,
      routeKey: apigwv2.HttpRouteKey.with(props.path, props.method),
      integration,
    })
    const routeCfn = route.node.defaultChild as apigwv2.CfnRoute
    routeCfn.authorizerId = props.authorizerId
    if (props.authorizerId) {
      routeCfn.authorizationType = 'JWT'
    } else {
      routeCfn.authorizationType = undefined
    }
  }
}