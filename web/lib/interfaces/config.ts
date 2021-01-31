const ns = 'KakaoAuthDemo'

export const AmplifyConfig = {
  Auth: {
    region: 'ap-northeast-2',
    userPoolId: '',           // TODO: replace with actual userpoolid
    userPoolWebClientId: '',  // TODO: replace with actual clientid
  },
}

export const Cognito = {
  Domain: `https://${ns.toLowerCase()}.auth.ap-northeast-2.amazoncognito.com`,
  RedirectUri: 'http://localhost:3000',
  Scopes: ['email', 'openid', 'profile'].join(' '),
}

export const IdentityProvider = {
  Google: {
    Url: `${Cognito.Domain}/oauth2/authorize?identity_provider=Google&redirect_uri=${Cognito.RedirectUri}&response_type=TOKEN&client_id=${AmplifyConfig.Auth.userPoolWebClientId}&scope=${Cognito.Scopes}`,
  },
  Kakao: {
    Token: ``, // TODO: replace with actual kakao client id
  }
}

const ApiHash = 'avfbz3y1ig' // TODO: replace with actual api url
export const ApiUrl = `https://${ApiHash}.execute-api.ap-northeast-2.amazonaws.com`