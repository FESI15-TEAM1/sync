import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import {
  type GetPlayroomsResponse,
  PLAYROOM_LIMIT_MAX,
  PLAYROOM_LIMIT_MIN,
} from '@/services/playroom/playroom.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get('limit');

  // 커서를 쓰지 않는 엔드포인트라 limit 만 받습니다. 넘어왔다면 1~50 범위의 정수만 허용합니다.
  let parsedLimit: number | undefined;

  if (limit !== null) {
    parsedLimit = Number(limit);

    if (
      limit.trim() === '' ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < PLAYROOM_LIMIT_MIN ||
      parsedLimit > PLAYROOM_LIMIT_MAX
    ) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        `limit 은 ${PLAYROOM_LIMIT_MIN}~${PLAYROOM_LIMIT_MAX} 사이의 정수여야 합니다.`,
      );
    }
  }

  const params: Record<string, string> = {};

  // 검증을 통과한 숫자를 다시 문자열로 만들어, 16진수 표기 같은 변형이 백엔드로 넘어가지 않게 합니다.
  if (parsedLimit !== undefined) params.limit = String(parsedLimit);

  try {
    const data = await serverFetch<GetPlayroomsResponse>('/playrooms/live', {
      method: 'GET',
      params,
    });

    return Response.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof APIError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.',
    );
  }
}
