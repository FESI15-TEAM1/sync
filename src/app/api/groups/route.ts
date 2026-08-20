import type { NextRequest } from 'next/server';

import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_TITLE_MAX_LENGTH,
} from '@/constants/group';
import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  CreateGroupRequest,
  CreateGroupResponse,
  GetGroupsResponse,
} from '@/services/group/group.types';

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

    const { title, description, image, isPublic, playlistIds } = (body ??
      {}) as Partial<CreateGroupRequest>;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';

    if (!trimmedTitle) {
      return errorResponse(400, 'VALIDATION_ERROR', 'title은 필수입니다.');
    }

    if (trimmedTitle.length > GROUP_TITLE_MAX_LENGTH) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        `그룹 이름은 ${GROUP_TITLE_MAX_LENGTH}자 이하로 입력해주세요.`,
      );
    }

    if (
      typeof description === 'string' &&
      description.length > GROUP_DESCRIPTION_MAX_LENGTH
    ) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        `그룹 소개는 ${GROUP_DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`,
      );
    }

    const payload: CreateGroupRequest = {
      title: trimmedTitle,
      description: typeof description === 'string' ? description : '',
      image: typeof image === 'string' ? image : undefined,
      isPublic: typeof isPublic === 'boolean' ? isPublic : true,
      playlistIds: Array.isArray(playlistIds)
        ? playlistIds.filter((id) => typeof id === 'number')
        : [],
    };

    const data = await serverFetch<CreateGroupResponse>('/groups', {
      method: 'POST',
      body: payload,
    });

    return Response.json(data, { status: 201 });
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

  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  // 범위를 벗어난 값은 백엔드가 자동 보정하므로 여기서는 형식만 넘깁니다.
  if (limit) params.limit = limit;

  try {
    const data = await serverFetch<GetGroupsResponse>('/groups', {
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
