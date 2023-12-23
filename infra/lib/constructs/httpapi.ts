import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

interface Props {
  userPoolId: string;
  userPoolClientId: string;
}

export class HttpApi extends Construct {
  public readonly api: apigwv2.HttpApi;
  public readonly authorizer: apigwv2.IHttpRouteAuthorizer;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const ns = this.node.tryGetContext('ns') as string;

    this.api = this.createHttpApi(ns);
    this.authorizer = this.createJWTAuthorizer(ns, this.api, props);
  }

  private createHttpApi(ns: string): apigwv2.HttpApi {
    return new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: `${ns}HttpApi`,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(7),
      },
    });
  }

  private createJWTAuthorizer(
    ns: string,
    httpApi: apigwv2.IHttpApi,
    props: Props
  ): apigwv2.IHttpRouteAuthorizer {
    const region = cdk.Stack.of(this).region;

    const authorizer = new apigwv2.HttpAuthorizer(this, `JWTAuthorizer`, {
      authorizerName: `${ns}JWTAuthorizer`,
      httpApi,
      type: apigwv2.HttpAuthorizerType.JWT,
      identitySource: ['$request.header.Authorization'],
      jwtAudience: [props.userPoolClientId],
      jwtIssuer: `https://cognito-idp.${region}.amazonaws.com/${props.userPoolId}`,
    });
    return apigwv2.HttpAuthorizer.fromHttpAuthorizerAttributes(
      this,
      `JWTRouteAuthorizer`,
      {
        authorizerId: authorizer.authorizerId,
        authorizerType: apigwv2.HttpAuthorizerType.JWT,
      }
    );
  }
}
