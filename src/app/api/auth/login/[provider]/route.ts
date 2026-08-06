import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BE_API_URL;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (provider !== 'kakao' && provider !== 'google') {
    return NextResponse.json(
      { error: '지원하지 않는 소셜 로그인입니다.' },
      { status: 400 },
    );
  }
  return NextResponse.redirect(`${BASE_URL}/oauth2/authorization/${provider}`);
}
