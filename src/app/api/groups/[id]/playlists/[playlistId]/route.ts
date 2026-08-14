import { NextResponse } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  GroupPlaylistResponse,
  HighlightGroupPlaylistRequest,
} from '@/services/group/group.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; playlistId: string }> },
) {
  try {
    const { id, playlistId } = await params;

    await serverFetch(`/groups/${id}/playlists/${playlistId}`, {
      method: 'DELETE',
    });

    return new NextResponse(null, { status: 204 });
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
  { params }: { params: Promise<{ id: string; playlistId: string }> },
) {
  try {
    const { id, playlistId } = await params;

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

    const { isHighlighted } = (body ?? {}) as Partial<HighlightGroupPlaylistRequest>;

    if (typeof isHighlighted !== 'boolean') {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        '하이라이트 여부는 필수입니다.',
      );
    }

    const payload: HighlightGroupPlaylistRequest = { isHighlighted };

    const data = await serverFetch<GroupPlaylistResponse>(
      `/groups/${id}/playlists/${playlistId}`,
      {
        method: 'PATCH',
        body: payload,
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
