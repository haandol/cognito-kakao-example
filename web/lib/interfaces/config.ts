const ns = 'KakaoAuthDemo'

export const AmplifyConfig = {
  Auth: {
    region: 'ap-northeast-2',
    userPoolId: '',           // TODO: replace with actual userpoolid
    userPoolWebClientId: '',  // TODO: replace with actual clientid
  },
}

const ApiHash = '' // TODO: replace with actual api url
export const ApiUrl = `https://${ApiHash}.execute-api.ap-northeast-2.amazonaws.com`

export const IdentityProvider = {
  Kakao: {
    AppKey: ``, // TODO: replace with actual kakao client id
  }
}