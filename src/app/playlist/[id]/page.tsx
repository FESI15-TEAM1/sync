import { loadPlaylistPageData } from '@/app/playlist/_lib/loadPlaylistPageData';

import PlaylistView from './_components/PlaylistView';

export default async function Playlist({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const routeUserId = (await params).id;

  const data = await loadPlaylistPageData(routeUserId);

  return (
    <div>
      <PlaylistView {...data} />
    </div>
  );
}
