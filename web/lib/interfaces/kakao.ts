import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { AmplifyConfig } from '@lib/interfaces/config';

export interface IAuthData {
  email: string;
  authResult: {
    IdToken: string;
    AccessToken: string;
    RefreshToken: string;
  };
}

export function setSession(data: IAuthData) {
  const userPool = new CognitoUserPool({
    UserPoolId: AmplifyConfig.Auth.userPoolId,
    ClientId: AmplifyConfig.Auth.userPoolWebClientId,
  });

  const cognitoUser = new CognitoUser({
    Username: data.email,
    Pool: userPool,
  });

  const session = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken: data.authResult.IdToken }),
    AccessToken: new CognitoAccessToken({
      AccessToken: data.authResult.AccessToken,
    }),
    RefreshToken: new CognitoRefreshToken({
      RefreshToken: data.authResult.RefreshToken,
    }),
  });
  cognitoUser.setSignInUserSession(session);
}
