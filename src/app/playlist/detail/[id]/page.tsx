import { cookies } from 'next/headers';

import PlaylistDetailView from '@/app/playlist/detail/[id]/_components/PlaylistDetailView';
import { getUserIdFromAccessToken } from '@/lib/http/auth-cookies';

export default async function PlaylistDeatilPage() {
  const userId = await getCurrentUserId();

  return (
    <div className="m-auto max-w-5xl">
      <PlaylistDetailView userid={userId} />
    </div>
  );
}

async function getCurrentUserId() {
  const cookieStore = await cookies();
  return getUserIdFromAccessToken(cookieStore.get('accessToken')?.value);
}
