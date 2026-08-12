import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { GroupRequestResponse } from '@/services/group/group.types';
import type { ProcessGroupRequestPayload } from '@/services/group/groupRequests.type';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  try {
    const { requestId } = await params;

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

    const { status, targetGroupId } = (body ?? {}) as Partial<
      Record<'status' | 'targetGroupId', unknown>
    >;

    if (status !== 'accepted' && status !== 'rejected') {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        'status 는 accepted 또는 rejected 여야 합니다.',
      );
    }

    const payload: ProcessGroupRequestPayload = {
      status,
      ...(typeof targetGroupId === 'number' ? { targetGroupId } : {}),
    };

    const data = await serverFetch<GroupRequestResponse>(
      `/group-requests/${requestId}`,
      { method: 'PATCH', body: payload },
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
