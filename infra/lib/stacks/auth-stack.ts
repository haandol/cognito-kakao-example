import * as cdk from '@aws-cdk/core'
import * as cognito from '@aws-cdk/aws-cognito'
import { CognitoUserPool } from '../constructs/cognito'

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.IUserPool
  public readonly userPoolClient: cognito.IUserPoolClient

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const cognitoUserPool = new CognitoUserPool(this, `CognitoUserPool`)
    this.userPool = cognitoUserPool.userPool
    this.userPoolClient = cognitoUserPool.userPoolClient
  }
}