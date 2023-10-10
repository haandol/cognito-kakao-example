import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { IAuthData, setSession } from '@lib/interfaces/kakao';
import { IdentityProvider, ApiUrl } from '@lib/interfaces/config';
import Script from 'next/script';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  var KakaoSdk;

  const code = searchParams.get('code');

  const signin = async (accessToken: string): Promise<IAuthData> => {
    const url = `${ApiUrl}/auth/kakao`;
    const resp = await axios.post(url, { access_token: accessToken });
    return resp.data;
  };

  const handleKakaoAuth = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!code) {
      await KakaoSdk.Auth.authorize({
        redirectUri: 'http://localhost:3000',
        scope: 'account_email',
      });
    } else {
      const response = await fetch('/api/exchange_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const tokens = await response.json();
      console.log('tokens: ', tokens);

      const data = await signin(tokens['access_token']);
      console.log(JSON.stringify(data));
      setSession(data);
      alert(`카카오 로그인 성공: ${data.email}`);
      router.push('/');
    }
  };

  let button;
  if (code) {
    button = <button onClick={handleKakaoAuth}>액세스 토큰 가져오기</button>;
  } else {
    button = <button onClick={handleKakaoAuth}>카카오 로그인</button>;
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
        integrity="sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('!!kakaosdk loaded.', window['Kakao']);
          KakaoSdk = window['Kakao'];
          KakaoSdk.init(IdentityProvider.Kakao.AppKey);
        }}
        onError={(e) => {
          console.error(e);
        }}
      />
      {button}
    </>
  );
}
