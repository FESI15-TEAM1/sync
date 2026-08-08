import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  EditGroupPlaylistsRequest,
  GroupDetailResponse,
  GroupPlaylistItem,
  UpdateGroupRequest,
} from '@/services/group/group.types';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const { title, description, image, isPublic } = (body ??
      {}) as Partial<UpdateGroupRequest>;

    const payload: UpdateGroupRequest = {
      ...(typeof title === 'string' ? { title } : {}),
      ...(typeof description === 'string' ? { description } : {}),
      ...(typeof image === 'string' ? { image } : {}),
      ...(typeof isPublic === 'boolean' ? { isPublic } : {}),
    };

    const data = await serverFetch<GroupDetailResponse>(`/groups/${id}`, {
      method: 'PATCH',
      body: payload,
    });

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const { playlistIds } = (body ??
      {}) as Partial<EditGroupPlaylistsRequest>;

    if (!Array.isArray(playlistIds)) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        'playlistIds는 필수입니다.',
      );
    }

    const payload: EditGroupPlaylistsRequest = {
      playlistIds: playlistIds.filter(
        (playlistId) => typeof playlistId === 'number',
      ),
    };

    const data = await serverFetch<GroupPlaylistItem[]>(
      `/groups/${id}/playlists`,
      { method: 'PUT', body: payload },
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
