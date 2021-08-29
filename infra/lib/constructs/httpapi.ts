import * as cdk from '@aws-cdk/core'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { App } from '../interfaces/config'

interface Props {
  userPoolId: string
  userPoolClientId: string
}

export class HttpApi extends cdk.Construct {
  public readonly api: apigwv2.HttpApi
  public readonly authorizer: apigwv2.IHttpRouteAuthorizer

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id)

    this.api = this.createHttpApi()
    this.authorizer = this.createJWTAuthorizer(this.api, props)
  }

  private createHttpApi(): apigwv2.HttpApi {
    return new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: `${App.Context.ns}HttpApi`,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(10),
      },
    })
  }

  private createJWTAuthorizer(httpApi: apigwv2.IHttpApi, props: Props): apigwv2.IHttpRouteAuthorizer {
    const region = cdk.Stack.of(this).region

    const authorizer = new apigwv2.HttpAuthorizer(this, `JWTAuthorizer`, {
      authorizerName: `${App.Context.ns}JWTAuthorizer`,
      httpApi,
      type: apigwv2.HttpAuthorizerType.JWT,
      identitySource: ['$request.header.Authorization'],
      jwtAudience: [props.userPoolClientId],
      jwtIssuer: `https://cognito-idp.${region}.amazonaws.com/${props.userPoolId}`,
    })
    return apigwv2.HttpAuthorizer.fromHttpAuthorizerAttributes(this, `JWTRouteAuthorizer`, {
      authorizerId: authorizer.authorizerId,
      authorizerType: apigwv2.HttpAuthorizerType.JWT,
    })
  }

}
