import { PLAYER_VOLUME_STORAGE_KEY } from '@/constants/localStorage';
import { getStorageItem, setStorageItem } from '@/utils/localStorage';

/** 지난 방문에서 저장해둔 볼륨. 값이 없거나 망가져 있으면 null 을 돌려준다. */
export function readStoredVolume() {
  const volume = getStorageItem<number>(PLAYER_VOLUME_STORAGE_KEY);
  if (typeof volume !== 'number') return null;
  if (!Number.isFinite(volume) || volume < 0 || volume > 100) return null;

  return volume;
}

export function writeStoredVolume(volume: number) {
  setStorageItem(PLAYER_VOLUME_STORAGE_KEY, volume);
}
