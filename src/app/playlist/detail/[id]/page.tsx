import PlaylistDetailView from '@/app/playlist/detail/[id]/_components/PlaylistDetailView';
import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export default async function PlaylistDeatilPage() {
  const userId = await getCurrentUserId();

  return (
    <div className="m-auto max-w-5xl">
      <PlaylistDetailView userid={userId} />
    </div>
  );
}
async function getCurrentUserId() {
  try {
    const me = await serverFetch<{ id: string }>('/users/me', {
      method: 'GET',
    });
    return me.id;
  } catch (error) {
    if (error instanceof APIError && error.status === 401) return null;
    throw error;
  }
}
