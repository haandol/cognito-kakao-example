import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as cognito from '@aws-cdk/aws-cognito'
import * as lambda from '@aws-cdk/aws-lambda'
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs'
import { App } from '../interfaces/config'

export interface IProps {
  userPoolId: string
  userPoolClientId: string
}

export class KakaoAuth extends cdk.Construct {
  public readonly kakaoAuthFunction: lambda.IFunction
  public readonly userGroup: cognito.CfnUserPoolGroup

  constructor(scope: cdk.Construct, id: string, props: IProps) {
    super(scope, id)

    this.kakaoAuthFunction = this.createKakaoAuthFunction(props)

    this.userGroup = new cognito.CfnUserPoolGroup(this, `KakaoGroup`, {
      userPoolId: props.userPoolId,
      description: 'Group for users who sign in using Kakao',
      groupName: `${props.userPoolId}_Kakao`,
    })
  }

  private createKakaoAuthFunction(props: IProps) {
    const fn = new lambdaNodejs.NodejsFunction(this, `KakaoAuthFunction`, {
      functionName: `${App.Context.ns}KakaoAuth`,
      entry: path.resolve(__dirname, '..', 'functions', 'kakao.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 1024,
      environment: {
        USER_POOL_ID: props.userPoolId,
        CLIENT_ID: props.userPoolClientId,
      },
    })
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cognito-idp:*'],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    }))
    return fn
  }

}