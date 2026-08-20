import {
  PLAYROOM_HASHTAG_MAX_COUNT,
  PLAYROOM_HASHTAG_MAX_LENGTH,
  PLAYROOM_HASHTAG_MIN_LENGTH,
} from '@/constants/playroom';

/**
 * '#' 뒤에 공백도 '#' 도 아닌 문자가 하나 이상 이어지는 구간을 태그로 본다.
 * 앞뒤에 무엇이 붙어 있든(`제이팝#락#감성`) 각각의 태그로 끊어낸다.
 */
const HASH_TAG_PATTERN = /#[^\s#]+/g;

export function hashTagToArray(description: string) {
  const hashTags = (description.match(HASH_TAG_PATTERN) ?? [])
    .map((tag) => tag.slice(1))
    // 너무 짧거나 긴 태그는 잘라내지 않고 통째로 버린다.
    .filter(
      (tag) =>
        tag.length >= PLAYROOM_HASHTAG_MIN_LENGTH &&
        tag.length <= PLAYROOM_HASHTAG_MAX_LENGTH,
    );

  return [...new Set(hashTags)].slice(0, PLAYROOM_HASHTAG_MAX_COUNT);
}
