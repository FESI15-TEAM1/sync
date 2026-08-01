import { http, HttpResponse } from 'msw';

import {
  EXISTING_USER_EMAIL,
  myProfile,
  TEST_VERIFICATION_CODE,
  User,
} from './fixtures';

const baseUrl = 'https://sync-back.store';

// 로그인 목업이 심어준 access_token 쿠키가 있어야 인증된 요청으로 취급한다.
function isAuthenticated(request: Request) {
  return (request.headers.get('cookie') ?? '').includes(
    'access_token=msw-access-token',
  );
}

const unauthorizedResponse = () =>
  HttpResponse.json(
    { error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' } },
    { status: 401 },
  );

export const handlers = [
  http.get(`${baseUrl}/users/me`, ({ request }) => {
    console.log('마이페이지 조회');

    if (!isAuthenticated(request)) {
      return unauthorizedResponse();
    }

    return HttpResponse.json(myProfile);
  }),
  http.patch(`${baseUrl}/users/me`, async ({ request }) => {
    console.log('마이페이지 수정');

    if (!isAuthenticated(request)) {
      return unauthorizedResponse();
    }

    const body = (await request.json()) as {
      nickname?: string;
      image?: string;
      description?: string;
    };

    if (body.nickname !== undefined) myProfile.nickname = body.nickname;
    if (body.image !== undefined) myProfile.image = body.image;
    if (body.description !== undefined) myProfile.description = body.description;

    return HttpResponse.json(myProfile);
  }),
  http.get(`${baseUrl}/auth/nickname-check`, ({ request }) => {
    console.log('닉네임 중복 확인');

    const nickname = new URL(request.url).searchParams.get('nickname');

    return HttpResponse.json({ available: nickname !== '중복닉네임' });
  }),
  http.post(`${baseUrl}/auth/email-verify-request`, () => {
    console.log('이메일 인증 코드 발송');

    return HttpResponse.json(null);
  }),
  http.post(`${baseUrl}/auth/email-verify-confirm`, async ({ request }) => {
    console.log('이메일 인증 코드 확인');

    const body = (await request.json()) as { code?: string };

    if (body.code !== TEST_VERIFICATION_CODE) {
      return HttpResponse.json(
        {
          error: {
            code: 'INVALID_CODE',
            message: '인증코드가 올바르지 않습니다.',
          },
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(null);
  }),
  http.post(`${baseUrl}/auth/login`, () => {
    console.log('로그인');

    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      'access_token=msw-access-token;HttpOnly;Path=/',
    );
    headers.append(
      'Set-Cookie',
      'refresh_token=msw-refresh-token;HttpOnly;Path=/',
    );

    return HttpResponse.json(User[1], { headers });
  }),
  http.post(`${baseUrl}/auth/logout`, () => {
    console.log('로그아웃');
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
      },
    });
  }),
  http.post(`${baseUrl}/auth/signup`, async ({ request }) => {
    console.log('회원가입');

    const body = (await request.json()) as { email?: string };

    if (body.email === EXISTING_USER_EMAIL) {
      return HttpResponse.json(
        {
          error: {
            code: 'USER_EXISTS',
            message: '이미 가입된 이메일입니다.',
          },
        },
        { status: 403 },
      );
    }

    return HttpResponse.json('ok', {
      status: 201,
      headers: {
        'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
      },
    });
  }),
];
