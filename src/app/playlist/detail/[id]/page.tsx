import { cookies } from 'next/headers';

import PlaylistDetailView from '@/app/playlist/detail/[id]/_components/PlaylistDetailView';
import { getUserIdFromAccessToken } from '@/lib/http/auth-cookies';

/**
 * 액세스 토큰에서 읽은 뷰어 ID를 전달하여 플레이리스트 상세 화면을 렌더링합니다.
 */
export default async function PlaylistDeatilPage() {
  const userId = await getCurrentUserId();

  return (
    <div className="m-auto max-w-5xl">
      <PlaylistDetailView userid={userId} />
    </div>
  );
}

/**
 * 상세 화면의 뷰어 식별용으로 액세스 토큰 쿠키의 sub를 서명 검증 없이 읽습니다.
 */
async function getCurrentUserId() {
  const cookieStore = await cookies();
  return getUserIdFromAccessToken(cookieStore.get('accessToken')?.value);
}
