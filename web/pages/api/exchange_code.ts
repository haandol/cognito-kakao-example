import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IdentityProvider } from '@lib/interfaces/config';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const data: any = req.body;

  const resp = await axios.post(
    'https://kauth.kakao.com/oauth/token',
    {
      grant_type: 'authorization_code',
      client_id: IdentityProvider.Kakao.ApiKey,
      redirect_uri: 'http://localhost:3000',
      code: data.code,
    },
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    }
  );
  return res.send(resp.data);
}
