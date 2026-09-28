import { redirect } from 'next/navigation';

import {
  getCurrentUserId,
  loadPlaylistPageData,
} from '@/app/playlist/_lib/loadPlaylistPageData';
import PlaylistView from '@/app/playlist/[id]/_components/PlaylistView';

export default async function PlayList() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    redirect('/login');
  }

  const data = await loadPlaylistPageData(String(userId), userId);

  return (
    <div>
      <PlaylistView {...data} />
    </div>
  );
}
