import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { App, IdentityProvider } from '../interfaces/config';

interface ITriggerFunctions {
  preSignup?: lambda.IFunction;
  postConfirmation?: lambda.IFunction;
  preAuthentication?: lambda.IFunction;
  postAuthentication?: lambda.IFunction;
}

export class CognitoUserPool extends Construct {
  public readonly userPool: cognito.IUserPool;
  public readonly userPoolClient: cognito.IUserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const triggerFunctions = this.createTriggerFunctions();
    this.userPool = this.createUserPool(triggerFunctions);
    this.userPoolClient = this.createUserPoolClient(this.userPool);
  }

  private createTriggerFunctions(): ITriggerFunctions {
    const preSignup = new lambdaNodejs.NodejsFunction(
      this,
      `PreSignupFunction`,
      {
        functionName: `${App.Context.ns}PreSignupTrigger`,
        entry: path.resolve(__dirname, '..', 'functions', 'pre-signup.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: cdk.Duration.seconds(5),
        memorySize: 128,
      }
    );
    const postConfirmation = new lambdaNodejs.NodejsFunction(
      this,
      `PostConfirmationFunction`,
      {
        functionName: `${App.Context.ns}PostConfirmTrigger`,
        entry: path.resolve(
          __dirname,
          '..',
          'functions',
          'post-confirmation.ts'
        ),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: cdk.Duration.seconds(5),
        memorySize: 128,
      }
    );
    const preAuthentication = new lambdaNodejs.NodejsFunction(
      this,
      `PreAuthenticationFunction`,
      {
        functionName: `${App.Context.ns}PreAuthenticationTrigger`,
        entry: path.resolve(
          __dirname,
          '..',
          'functions',
          'pre-authentication.ts'
        ),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: cdk.Duration.seconds(5),
        memorySize: 128,
      }
    );

    return {
      preSignup,
      postConfirmation,
      preAuthentication,
    };
  }

  private createUserPool(triggerFunctions: ITriggerFunctions) {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `${App.Context.ns}UserPool`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true },
      },
      customAttributes: {
        provider: new cognito.StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        requireDigits: true,
        requireSymbols: false,
        requireLowercase: true,
        requireUppercase: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      lambdaTriggers: {
        preSignUp: triggerFunctions.preSignup,
        postConfirmation: triggerFunctions.postConfirmation,
        preAuthentication: triggerFunctions.preAuthentication,
        postAuthentication: triggerFunctions.postAuthentication,
      },
    });
    new cognito.UserPoolDomain(this, `UserPoolDomain`, {
      userPool,
      cognitoDomain: {
        domainPrefix: `${App.Context.ns.toLowerCase()}${
          cdk.Stack.of(this).account
        }`,
      },
    });
    return userPool;
  }

  private createUserPoolClient(
    userPool: cognito.IUserPool
  ): cognito.IUserPoolClient {
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPoolClientName: `${App.Context.ns}UserPoolClient`,
      userPool,
      authFlows: {
        adminUserPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [IdentityProvider.RedirectUri],
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
          cognito.OAuthScope.OPENID,
        ],
      },
      preventUserExistenceErrors: true,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });
    return userPoolClient;
  }
}
