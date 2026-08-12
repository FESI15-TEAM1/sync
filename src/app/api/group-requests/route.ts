import { type NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  CreateGroupRequestPayload,
  GroupRequestResponse,
} from '@/services/group/group.types';
import type { GetGroupRequestsResponse } from '@/services/group/groupRequests.type';

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

    const { sourceType, sourceId } = (body ?? {}) as Partial<
      Record<'sourceType' | 'sourceId', unknown>
    >;

    if (
      (sourceType !== 'group' && sourceType !== 'playlist') ||
      typeof sourceId !== 'number'
    ) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        'sourceType과 sourceId는 필수입니다.',
      );
    }

    const payload: CreateGroupRequestPayload = {
      sourceType,
      sourceId,
    };

    const data = await serverFetch<GroupRequestResponse>('/group-requests', {
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
  if (limit) params.limit = limit;

  try {
    const data = await serverFetch<GetGroupRequestsResponse>(
      '/group-requests',
      { method: 'GET', params },
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
