import Head from 'next/head'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import KakaoButton from 'react-kakao-button'
import * as Kakao from '@lib/interfaces/kakao'
import { IdentityProvider, ApiUrl } from '@lib/interfaces/config'

export default function Home() {
  const router = useRouter()

  let KakaoSdk
  useEffect(() => {
    if (process.browser) {
      KakaoSdk = window['Kakao']
      if (KakaoSdk && !KakaoSdk.isInitialized()) {
        KakaoSdk.init(IdentityProvider.Kakao.AppKey)
      }
    }
  }, [])

  const handleKakaoAuth = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const auth = await Kakao.signin(KakaoSdk)
    const url = `${ApiUrl}/auth/kakao`
    const resp = await axios.post(url, { access_token: auth.access_token })
    const data: Kakao.IAuthData = resp.data
    console.log(JSON.stringify(data))
    Kakao.setSession(data)
    alert('Kakao Signin Success!!')
    router.push('/')
  }

  return (
    <>
      <Head>
        <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
      </Head>

      <KakaoButton disabled={false} onClick={handleKakaoAuth} />
    </>
  )
}
