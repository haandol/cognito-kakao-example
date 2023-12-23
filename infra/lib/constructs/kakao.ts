import * as path from 'path';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export interface IProps {
  userPoolId: string;
  userPoolClientId: string;
}

export class KakaoAuth extends Construct {
  public readonly pingFunction: lambda.IFunction;
  public readonly userGroup: cognito.CfnUserPoolGroup;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const ns = this.node.tryGetContext('ns') as string;

    this.pingFunction = this.createPingFunction(ns);

    this.userGroup = new cognito.CfnUserPoolGroup(this, `KakaoGroup`, {
      userPoolId: props.userPoolId,
      description: 'Group for users who sign in using Kakao',
      groupName: `${props.userPoolId}_Kakao`,
    });
  }

  private createPingFunction(ns: string) {
    const fn = new lambdaNodejs.NodejsFunction(this, `PingFunction`, {
      functionName: `${ns}Ping`,
      entry: path.resolve(__dirname, '..', 'functions', 'ping.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
    });
    return fn;
  }
}
