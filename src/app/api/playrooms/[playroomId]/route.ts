import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  PlayroomDetailResponse,
  PlayroomUpdateRequest,
} from '@/services/playroom/playroomDetail.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

// 동적 세그먼트는 항상 문자열로 넘어오므로 숫자 형식인지 직접 확인합니다.
function parsePlayroomId(playroomId: string) {
  const parsedPlayroomId = Number(playroomId);

  if (!Number.isInteger(parsedPlayroomId) || parsedPlayroomId <= 0) return null;

  return parsedPlayroomId;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ playroomId: string }> },
) {
  const { playroomId } = await params;
  const parsedPlayroomId = parsePlayroomId(playroomId);

  if (parsedPlayroomId === null) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      '유효하지 않은 방 ID 입니다.',
    );
  }

  try {
    const data = await serverFetch<PlayroomDetailResponse>(
      `/playrooms/${parsedPlayroomId}`,
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ playroomId: string }> },
) {
  const { playroomId } = await params;
  const parsedPlayroomId = parsePlayroomId(playroomId);

  if (parsedPlayroomId === null) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      '유효하지 않은 방 ID 입니다.',
    );
  }

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

    const { title, description, hashtags } = (body ??
      {}) as Partial<PlayroomUpdateRequest>;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';

    if (!trimmedTitle) {
      return errorResponse(400, 'VALIDATION_ERROR', '제목은 필수입니다.');
    }

    // 생략한 필드는 백엔드에서 기존 값이 유지되므로, 넘어온 필드만 실어 보냅니다.
    const payload: PlayroomUpdateRequest = { title: trimmedTitle };

    if (typeof description === 'string') payload.description = description;

    if (Array.isArray(hashtags)) {
      payload.hashtags = hashtags.filter(
        (hashTag) => typeof hashTag === 'string',
      );
    }

    const data = await serverFetch<PlayroomDetailResponse>(
      `/playrooms/${parsedPlayroomId}`,
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ playroomId: string }> },
) {
  const { playroomId } = await params;
  const parsedPlayroomId = parsePlayroomId(playroomId);

  if (parsedPlayroomId === null) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      '유효하지 않은 방 ID 입니다.',
    );
  }

  try {
    await serverFetch<null>(`/playrooms/${parsedPlayroomId}`, {
      method: 'DELETE',
    });

    // 방송 종료는 본문 없이 204 로 응답합니다.
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
