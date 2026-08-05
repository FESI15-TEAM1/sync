import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  UploadUrlRequest,
  UploadUrlResponse,
} from '@/services/upload/upload.types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UploadUrlRequest;

    const data = await serverFetch<UploadUrlResponse>('/uploads', {
      method: 'POST',
      body,
    });

    return Response.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }

    return Response.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 },
    );
  }
}
