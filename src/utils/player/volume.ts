import { PLAYER_VOLUME_STORAGE_KEY } from '@/constants/localStorage';

/** 지난 방문에서 저장해둔 볼륨. 값이 없거나 망가져 있으면 null 을 돌려준다. */
export function readStoredVolume() {
  try {
    const stored = window.localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);
    if (stored === null) return null;

    const volume = Number(stored);
    if (!Number.isFinite(volume) || volume < 0 || volume > 100) return null;

    return volume;
  } catch {
    // 저장소를 막아둔 브라우저에서는 기본값으로 시작한다.
    return null;
  }
}

export function writeStoredVolume(volume: number) {
  try {
    window.localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, String(volume));
  } catch {
    // 저장에 실패해도 이번 재생에는 영향이 없으므로 넘어간다.
  }
}
