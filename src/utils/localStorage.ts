/** 키에 해당하는 값을 localStorage 에 저장한다. 값은 JSON 으로 직렬화한다. */
export function setStorageItem<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장소를 막아둔 브라우저이거나 용량이 가득 찬 경우로, 저장만 건너뛴다.
  }
}

/** 키에 저장해둔 값을 읽어온다. 값이 없거나 망가져 있으면 null 을 돌려준다. */
export function getStorageItem<T>(key: string): T | null {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return null;

    return JSON.parse(stored) as T;
  } catch {
    // 저장소를 막아뒀거나 JSON 이 깨진 경우 기본값으로 시작한다.
    return null;
  }
}

/** 키에 저장해둔 값을 지운다. */
export function removeStorageItem(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 저장소를 막아둔 브라우저인 경우로, 지우기만 건너뛴다.
  }
}
