export function hashTagToArray(description: string) {
  const hashTags = description
    // 줄바꿈으로 구분한 해시태그도 인식하도록 모든 공백 문자를 구분자로 사용한다.
    .split(/\s+/)
    .filter((word) => word.startsWith('#'))
    .map((word) => word.slice(1))
    .filter(Boolean);

  return [...new Set(hashTags)];
}
