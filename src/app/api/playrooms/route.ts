import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  CreatePlayroomRequest,
  CreatePlayroomResponse,
  GetPlayroomsResponse,
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
      {}) as Partial<CreatePlayroomRequest>;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';

    if (!trimmedTitle) {
      return errorResponse(400, 'VALIDATION_ERROR', '제목은 필수입니다.');
    }

    if (typeof playlistId !== 'number') {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        '공유할 플레이리스트를 선택해주세요.',
      );
    }

    const payload: CreatePlayroomRequest = {
      title: trimmedTitle,
      description: typeof description === 'string' ? description : '',
      playlistId,
      hashtags: Array.isArray(hashtags)
        ? hashtags.filter((hashTag) => typeof hashTag === 'string')
        : [],
    };

    const data = await serverFetch<CreatePlayroomResponse>('/playrooms', {
      method: 'POST',
      body: payload,
    });

    return Response.json({ id: data.id }, { status: 201 });
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor');
  const limit = searchParams.get('limit');

  if (limit !== null && !/^\d+$/.test(limit)) {
    return errorResponse(400, 'VALIDATION_ERROR', 'limit 은 숫자여야 합니다.');
  }

  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;

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
