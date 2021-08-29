import * as cdk from '@aws-cdk/core'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { HttpApi } from '../constructs/httpapi'
import { App } from '../interfaces/config'

interface Props extends cdk.StackProps {
  userPoolId: string
  userPoolClientId: string
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigwv2.IHttpApi
  public readonly authorizer: apigwv2.IHttpRouteAuthorizer

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props)

    const httpApi = new HttpApi(this, `HttpApi`, {
      userPoolId: props.userPoolId,
      userPoolClientId: props.userPoolClientId,
    })
    this.api = httpApi.api
    this.authorizer = httpApi.authorizer

    new cdk.CfnOutput(this, `HttpApiUrl`, {
      exportName: `${App.Context.ns}HttpApiUrl`,
      value: `${httpApi.api.url}` || 'undefined',
    })
  }

}
