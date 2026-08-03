import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: '인증되지않은 사용자 입니다.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const res = await fetch(`https://sync-back.store/playlists/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to add track' },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: '유요하지 않은 json body 입니다' },
      { status: 400 },
    );
  }
}
