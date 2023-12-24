import type { ResourcesConfig, AuthUserPoolConfig } from '@aws-amplify/core';

const DomainName = 'xxxxx'; // TODO: replace with actual domainName

const AuthConfig: AuthUserPoolConfig = {
  Cognito: {
    userPoolId: '', // TODO: replace with actual cognito userpoolid
    userPoolClientId: '', // TODO: replace with actual cognito clientid
    loginWith: {
      oauth: {
        domain: `${DomainName}.auth.ap-northeast-2.amazoncognito.com`,
        scopes: ['openid'],
        redirectSignIn: ['http://localhost:3000/callback'],
        redirectSignOut: ['http://localhost:3000'],
        responseType: 'token',
      },
      username: true,
    },
  },
};

export const AmplifyConfig: ResourcesConfig = {
  Auth: AuthConfig,
};
