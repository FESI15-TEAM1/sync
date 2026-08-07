import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { GetPublicGroupsResponse } from '@/services/group/group.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
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
    const data = await serverFetch<GetPublicGroupsResponse>(
      '/groups/public',
      {
        method: 'GET',
        params,
      },
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
