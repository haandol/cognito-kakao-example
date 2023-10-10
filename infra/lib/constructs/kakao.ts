import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export interface IProps {
  userPoolId: string;
  userPoolClientId: string;
}

export class KakaoAuth extends Construct {
  public readonly kakaoAuthFunction: lambda.IFunction;
  public readonly pingFunction: lambda.IFunction;
  public readonly userGroup: cognito.CfnUserPoolGroup;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const ns = this.node.tryGetContext('ns') as string;

    this.kakaoAuthFunction = this.createKakaoAuthFunction(ns, props);
    this.pingFunction = this.createPingFunction(ns);

    this.userGroup = new cognito.CfnUserPoolGroup(this, `KakaoGroup`, {
      userPoolId: props.userPoolId,
      description: 'Group for users who sign in using Kakao',
      groupName: `${props.userPoolId}_Kakao`,
    });
  }

  private createKakaoAuthFunction(ns: string, props: IProps) {
    const fn = new lambdaNodejs.NodejsFunction(this, `KakaoAuthFunction`, {
      functionName: `${ns}KakaoAuth`,
      entry: path.resolve(__dirname, '..', 'functions', 'kakao.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
      environment: {
        USER_POOL_ID: props.userPoolId,
        CLIENT_ID: props.userPoolClientId,
      },
    });
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cognito-idp:*'],
        resources: ['*'],
      })
    );
    return fn;
  }

  private createPingFunction(ns: string) {
    const fn = new lambdaNodejs.NodejsFunction(this, `PingFunction`, {
      functionName: `${ns}Ping`,
      entry: path.resolve(__dirname, '..', 'functions', 'ping.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(1),
      memorySize: 128,
    });
    return fn;
  }
}
