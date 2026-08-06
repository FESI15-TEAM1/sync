import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  CreateGroupRequest,
  CreateGroupResponse,
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
