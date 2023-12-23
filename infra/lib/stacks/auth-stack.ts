import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from '../constructs/cognito';

interface IProps extends cdk.StackProps {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUris: string[];
}

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.IUserPool;
  public readonly userPoolClient: cognito.IUserPoolClient;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const cognitoUserPool = new CognitoUserPool(this, `CognitoUserPool`, props);
    this.userPool = cognitoUserPool.userPool;
    this.userPoolClient = cognitoUserPool.userPoolClient;
  }
}
