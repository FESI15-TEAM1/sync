import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  LikePlaylistResponse,
  MyplaylistResponse,
  Playlist,
} from '@/services/playlist/playlistCard.type';
import type { UserProfile } from '@/services/user/user.types';

export interface PlaylistPageData {
  userId: string;
  initialMyData: MyplaylistResponse;
  initialProfile: UserProfile;
  likedData: Playlist[];
  isOwner: boolean;
}

export async function getCurrentUserId() {
  try {
    const me = await serverFetch<{ id: number }>('/users/me', {
      method: 'GET',
    });
    return me.id;
  } catch (error) {
    if (error instanceof APIError) return null;
    throw error;
  }
}

// knownCurrentUserId를 넘기면 /users/me를 다시 조회하지 않는다
// (/playlist가 로그인 사용자 id를 이미 알고 있는 경우 중복 호출을 피하기 위함)
export async function loadPlaylistPageData(
  routeUserId: string,
  knownCurrentUserId?: number | null,
): Promise<PlaylistPageData> {
  const [initialMyData, initialProfile, currentUserId] = await Promise.all([
    serverFetch<MyplaylistResponse>(`/users/${routeUserId}/playlists`, {
      method: 'GET',
    }),
    serverFetch<UserProfile>(`/users/${routeUserId}`, {
      method: 'GET',
    }),
    knownCurrentUserId !== undefined
      ? Promise.resolve(knownCurrentUserId)
      : getCurrentUserId(),
  ]);

  const isOwner = currentUserId === Number(routeUserId);

  const initialLikeData = isOwner
    ? await serverFetch<LikePlaylistResponse>(`/users/me/liked-playlists`, {
        method: 'GET',
      })
    : null;

  return {
    userId: routeUserId,
    initialMyData,
    initialProfile,
    likedData: initialLikeData?.items ?? [],
    isOwner,
  };
}
