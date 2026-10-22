import { cookies } from 'next/headers';

import { getUserIdFromAccessToken } from '@/lib/http/auth-cookies';
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

/**
 * 액세스 토큰 쿠키의 sub를 숫자 ID로 변환하고, 읽거나 변환할 수 없으면 null을 반환합니다.
 * 서명을 검증하지 않으므로 표시 및 소유자 UI 판단에만 사용합니다.
 */
export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const sub = getUserIdFromAccessToken(cookieStore.get('accessToken')?.value);
  const id = Number(sub);
  return sub === null || Number.isNaN(id) ? null : id;
}

/**
 * 사용자 프로필과 플레이리스트를 불러오고, 소유자인 경우 좋아요 목록도 포함합니다.
 * @param routeUserId 조회할 플레이리스트 소유자의 ID입니다.
 * @param knownCurrentUserId 전달하면 토큰을 다시 읽지 않습니다. null은 비로그인 상태이며,
 * 소유자로 확인된 경우 좋아요 목록도 다른 요청과 병렬로 불러옵니다.
 * @returns 플레이리스트 화면의 초기 데이터와 소유자 여부입니다.
 */
export async function loadPlaylistPageData(
  routeUserId: string,
  knownCurrentUserId?: number | null,
): Promise<PlaylistPageData> {
  const knownIsOwner =
    knownCurrentUserId !== undefined
      ? knownCurrentUserId === Number(routeUserId)
      : null;

  const [initialMyData, initialProfile, currentUserId, likedByDefault] =
    await Promise.all([
      serverFetch<MyplaylistResponse>(`/users/${routeUserId}/playlists`, {
        method: 'GET',
      }),
      serverFetch<UserProfile>(`/users/${routeUserId}`, {
        method: 'GET',
      }),
      knownCurrentUserId !== undefined
        ? Promise.resolve(knownCurrentUserId)
        : getCurrentUserId(),
      knownIsOwner
        ? serverFetch<LikePlaylistResponse>(`/users/me/liked-playlists`, {
            method: 'GET',
          })
        : null,
    ]);

  const isOwner = currentUserId === Number(routeUserId);

  // knownIsOwner를 미리 알 수 없었던 경우([id]/page.tsx)만 여기서 따로 조회한다
  const initialLikeData =
    likedByDefault ??
    (isOwner
      ? await serverFetch<LikePlaylistResponse>(`/users/me/liked-playlists`, {
          method: 'GET',
        })
      : null);

  return {
    userId: routeUserId,
    initialMyData,
    initialProfile,
    likedData: initialLikeData?.items ?? [],
    isOwner,
  };
}
