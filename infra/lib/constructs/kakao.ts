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
  public readonly checkFunction: lambda.IFunction;
  public readonly userGroup: cognito.CfnUserPoolGroup;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const ns = this.node.tryGetContext('ns') as string;

    this.checkFunction = this.createCheckFunction(ns);

    this.userGroup = new cognito.CfnUserPoolGroup(this, `KakaoGroup`, {
      userPoolId: props.userPoolId,
      description: 'Group for users who sign in using Kakao',
      groupName: `${props.userPoolId}_Kakao`,
    });
  }

  private createCheckFunction(ns: string) {
    const fn = new lambdaNodejs.NodejsFunction(this, `Check`, {
      functionName: `${ns}Check`,
      entry: path.resolve(__dirname, '..', 'functions', 'check.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
    });
    return fn;
  }
}
