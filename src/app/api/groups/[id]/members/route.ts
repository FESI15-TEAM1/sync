import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  GetGroupMembersResponse,
  GroupMemberResponse,
  JoinGroupByCodeRequest,
} from '@/services/group/group.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor');
  const limit = searchParams.get('limit');

  const queryParams: Record<string, string> = {};

  if (cursor) queryParams.cursor = cursor;
  // 범위를 벗어난 값은 백엔드가 자동 보정하므로 여기서는 형식만 넘깁니다.
  if (limit) queryParams.limit = limit;

  try {
    const data = await serverFetch<GetGroupMembersResponse>(
      `/groups/${id}/members`,
      {
        method: 'GET',
        params: queryParams,
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

    const { inviteCode } = (body ?? {}) as Partial<JoinGroupByCodeRequest>;

    if (typeof inviteCode !== 'string' || inviteCode.length === 0) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        'inviteCode는 필수입니다.',
      );
    }

    const data = await serverFetch<GroupMemberResponse>(
      `/groups/${id}/members`,
      {
        method: 'POST',
        body: { inviteCode } satisfies JoinGroupByCodeRequest,
      },
    );

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
