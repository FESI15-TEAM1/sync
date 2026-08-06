import { cookies } from 'next/headers';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { setAuthCookies } from '@/lib/http/auth-cookies';

const BASE_URL = process.env.NEXT_PUBLIC_BE_API_URL!;

interface SocialExchangeResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=social', req.url));
  }

  const response = await fetch(`${BASE_URL}/auth/social/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    return NextResponse.redirect(new URL('/login?error=social', req.url));
  }

  const tokens: SocialExchangeResponse = await response.json();

  const cookieStore = await cookies();
  setAuthCookies(cookieStore, tokens);

  return NextResponse.redirect(new URL('/', req.url));
}
