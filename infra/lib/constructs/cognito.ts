import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

interface IProps {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUris: string[];
}

export class CognitoUserPool extends Construct {
  public readonly userPool: cognito.IUserPool;
  public readonly userPoolClient: cognito.IUserPoolClient;

  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id);

    const ns = this.node.tryGetContext('ns') as string;

    this.userPool = this.newUserPool(ns);
    this.userPoolClient = this.newUserPoolClient(ns, this.userPool, props);
  }

  private newUserPool(ns: string) {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `${ns}UserPool`,
      selfSignUpEnabled: true,
      signInAliases: { username: true },
      accountRecovery: cognito.AccountRecovery.NONE,
    });
    const domain = new cognito.UserPoolDomain(this, `UserPoolDomain`, {
      userPool,
      cognitoDomain: {
        domainPrefix: `${ns.toLowerCase()}${cdk.Stack.of(this).account}`,
      },
    });
    new cdk.CfnOutput(this, 'UserPoolDomainName', {
      value: domain.domainName,
    });
    return userPool;
  }

  private newUserPoolClient(
    ns: string,
    userPool: cognito.IUserPool,
    props: IProps
  ): cognito.IUserPoolClient {
    const oidcProvider = new cognito.UserPoolIdentityProviderOidc(
      this,
      'OIDCProvider',
      {
        name: 'KakaotalkOIDC',
        clientId: props.clientId,
        clientSecret: props.clientSecret,
        issuerUrl: 'https://kauth.kakao.com',
        userPool,
        scopes: props.scopes,
        attributeRequestMethod: cognito.OidcAttributeRequestMethod.GET,
      }
    );
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPoolClientName: `${ns}UserPoolClient`,
      userPool,
      oAuth: {
        flows: {
          // authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: props.redirectUris,
      },
      preventUserExistenceErrors: true,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.custom(
          oidcProvider.providerName
        ),
      ],
    });
    userPoolClient.node.addDependency(oidcProvider);
    return userPoolClient;
  }
}
