import type { ResourcesConfig, AuthUserPoolConfig } from '@aws-amplify/core';

const AuthConfig: AuthUserPoolConfig = {
  Cognito: {
    userPoolId: '', // TODO: replace with actual cognito userpoolid
    userPoolClientId: '', // TODO: replace with actual cognito clientid
    loginWith: {
      oauth: {
        domain: 'xxxxx.auth.ap-northeast-2.amazoncognito.com', // TODO: replace with actual domain address
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
