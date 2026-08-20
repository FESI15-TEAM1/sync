import type { NextRequest } from 'next/server';

import {
  MY_PLAYROOM_MAX_COUNT,
  PLAYROOM_DESCRIPTION_MAX_LENGTH,
  PLAYROOM_TITLE_MAX_LENGTH,
} from '@/constants/playroom';
import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import {
  type GetPlayroomsResponse,
  PLAYROOM_LIMIT_MAX,
  PLAYROOM_LIMIT_MIN,
  type PlayroomCreateRequest,
  type PlayroomCreateResponse,
} from '@/services/playroom/playroom.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        '유효하지 않은 요청 형식입니다.',
      );
    }

    const { title, description, playlistId, hashtags } = (body ??
      {}) as Partial<PlayroomCreateRequest>;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';

    if (!trimmedTitle) {
      return errorResponse(400, 'VALIDATION_ERROR', '제목은 필수입니다.');
    }

    if (trimmedTitle.length > PLAYROOM_TITLE_MAX_LENGTH) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        `제목은 ${PLAYROOM_TITLE_MAX_LENGTH}자 이하로 입력해주세요.`,
      );
    }

    if (
      typeof description === 'string' &&
      description.length > PLAYROOM_DESCRIPTION_MAX_LENGTH
    ) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        `설명은 ${PLAYROOM_DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`,
      );
    }

    if (typeof playlistId !== 'number') {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        '공유할 플레이리스트를 선택해주세요.',
      );
    }

    const payload: PlayroomCreateRequest = {
      title: trimmedTitle,
      description: typeof description === 'string' ? description : '',
      playlistId,
      hashtags: Array.isArray(hashtags)
        ? hashtags.filter((hashTag) => typeof hashTag === 'string')
        : [],
    };

    const data = await serverFetch<PlayroomCreateResponse>('/playrooms', {
      method: 'POST',
      body: payload,
    });

    return Response.json({ id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) {
      // 409 는 이미 최대 개수만큼 방을 열어 둔 경우입니다. 안내 문구를 고정해서 내려줍니다.
      if (error.status === 409) {
        return errorResponse(
          409,
          error.code,
          `플레이룸은 최대 ${MY_PLAYROOM_MAX_COUNT}개까지 만들 수 있습니다. 기존 플레이룸을 닫은 뒤 다시 시도해주세요.`,
        );
      }

      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      '서버 오류가 발생했습니다.',
    );
  }
}

export async function GET(req: NextRequest) {
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

  if (cursor) params.cursor = cursor;
  // 검증을 통과한 숫자를 다시 문자열로 만들어, 16진수 표기 같은 변형이 백엔드로 넘어가지 않게 합니다.
  if (parsedLimit !== undefined) params.limit = String(parsedLimit);

  try {
    const data = await serverFetch<GetPlayroomsResponse>('/playrooms', {
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
