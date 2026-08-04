import { NextResponse } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const data = await serverFetch(`/playlists/${params.id}`, {
      method: 'POST',
      body,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: '유효하지 않은 json body 입니다' },
      { status: 400 },
    );
  }
}
