import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import {
  type GetPlayroomMessagesResponse,
  PLAYROOM_MESSAGE_LIMIT_MAX,
  PLAYROOM_MESSAGE_LIMIT_MIN,
} from '@/services/playroom/playroomMessage.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

// 동적 세그먼트는 항상 문자열로 넘어오므로 숫자 형식인지 직접 확인합니다.
function parsePlayroomId(playroomId: string) {
  const parsedPlayroomId = Number(playroomId);

  if (!Number.isInteger(parsedPlayroomId) || parsedPlayroomId <= 0) return null;

  return parsedPlayroomId;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ playroomId: string }> },
) {
  const { playroomId } = await params;
  const parsedPlayroomId = parsePlayroomId(playroomId);

  if (parsedPlayroomId === null) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      '유효하지 않은 방 ID 입니다.',
    );
  }

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor');
  const limit = searchParams.get('limit');

  // limit 은 생략 가능하지만, 넘어왔다면 1~50 범위의 정수만 허용합니다.
  let parsedLimit: number | undefined;

  if (limit !== null) {
    parsedLimit = Number(limit);

    if (
      limit.trim() === '' ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < PLAYROOM_MESSAGE_LIMIT_MIN ||
      parsedLimit > PLAYROOM_MESSAGE_LIMIT_MAX
    ) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        `limit 은 ${PLAYROOM_MESSAGE_LIMIT_MIN}~${PLAYROOM_MESSAGE_LIMIT_MAX} 사이의 정수여야 합니다.`,
      );
    }
  }

  const backendParams: Record<string, string> = {};

  if (cursor) backendParams.cursor = cursor;
  // 검증을 통과한 숫자를 다시 문자열로 만들어, 16진수 표기 같은 변형이 백엔드로 넘어가지 않게 합니다.
  if (parsedLimit !== undefined) backendParams.limit = String(parsedLimit);

  try {
    const data = await serverFetch<GetPlayroomMessagesResponse>(
      `/playrooms/${parsedPlayroomId}/messages`,
      { method: 'GET', params: backendParams },
    );

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
