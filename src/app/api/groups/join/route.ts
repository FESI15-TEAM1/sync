import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  GroupDetailResponse,
  JoinGroupByInviteCodeRequest,
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

    const { inviteCode } = (body ??
      {}) as Partial<JoinGroupByInviteCodeRequest>;

    if (typeof inviteCode !== 'string' || inviteCode.length === 0) {
      return errorResponse(400, 'VALIDATION_ERROR', '초대코드는 필수입니다.');
    }

    const data = await serverFetch<GroupDetailResponse>('/groups/join', {
      method: 'POST',
      body: { inviteCode } satisfies JoinGroupByInviteCodeRequest,
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
