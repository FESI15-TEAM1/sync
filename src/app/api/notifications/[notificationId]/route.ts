import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { NotificationItem } from '@/services/notifications/notifications.type';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  try {
    const { notificationId } = await params;

    const data = await serverFetch<NotificationItem>(
      `/notifications/${notificationId}`,
      { method: 'PATCH', body: { isRead: true } },
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
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  try {
    const { notificationId } = await params;

    await serverFetch(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });

    return new Response(null, { status: 204 });
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
