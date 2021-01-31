import * as cdk from '@aws-cdk/core'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { App } from '../interfaces/config'

interface Props {
  userPoolId: string
  userPoolClientId: string
}

export class HttpApi extends cdk.Construct {
  public readonly api: apigwv2.HttpApi
  public readonly requestAuthorizerId: string

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id)

    this.api = this.createHttpApi()
    const requestAuthorizer = this.createJWTAuthorizer(this.api.httpApiId, props)
    this.requestAuthorizerId = requestAuthorizer.ref
  }

  private createHttpApi(): apigwv2.HttpApi {
    return new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: `${App.Context.ns}HttpApi`,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [
          apigwv2.HttpMethod.GET, apigwv2.HttpMethod.OPTIONS,
          apigwv2.HttpMethod.POST, apigwv2.HttpMethod.PUT,
        ],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(10),
      },
    })
  }

  private createJWTAuthorizer(apiId: string, props: Props): apigwv2.CfnAuthorizer {
    const { region } = App.Context

    const authorizer = new apigwv2.CfnAuthorizer(this, `JWTAuthorizer`, {
      apiId,
      authorizerType: 'JWT',
      identitySource: ['$request.header.Authorization'],
      name: 'JWTAuthorizer',
      authorizerResultTtlInSeconds: 0,
      jwtConfiguration: {
        audience: [props.userPoolClientId],
        issuer: `https://cognito-idp.${region}.amazonaws.com/${props.userPoolId}`,
      }
    })
    return authorizer
  }

}
