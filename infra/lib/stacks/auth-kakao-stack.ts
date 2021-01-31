import * as cdk from '@aws-cdk/core'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { BaseApiStack } from '../interfaces/base-stack'
import { KakaoAuth } from '../constructs/kakao'

interface Props extends cdk.StackProps {
  api: apigwv2.IHttpApi
  authorizerId: string
  userPoolId: string
  userPoolClientId: string
}

export class AuthKakaoStack extends BaseApiStack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props)

    const kakaoAuth = new KakaoAuth(this, `KakaoAuth`, {
      userPoolId: props.userPoolId,
      userPoolClientId: props.userPoolClientId,
    })

    this.addRoute({
      api: props.api,
      routeId: 'AuthKakao',
      path: '/auth/kakao',
      method: apigwv2.HttpMethod.POST,
      handler: kakaoAuth.kakaoAuthFunction,
    })
  }

}
