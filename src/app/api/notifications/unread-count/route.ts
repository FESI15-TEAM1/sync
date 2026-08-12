import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { responseNotificationsUnreadCountType } from '@/services/notifications/notifications.type';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function GET() {
  try {
    const data = await serverFetch<responseNotificationsUnreadCountType>(
      '/notifications/unread-count',
      { method: 'GET' },
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
