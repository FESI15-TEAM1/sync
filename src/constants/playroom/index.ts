/** 방 제목·설명 길이 제한. */
export const PLAYROOM_TITLE_MAX_LENGTH = 50;
export const PLAYROOM_DESCRIPTION_MAX_LENGTH = 150;

/**
 * 해시태그 제한. 길이를 벗어나는 태그는 버리고, 상한을 넘는 태그는 앞에서부터 9개만 남깁니다.
 */
export const PLAYROOM_HASHTAG_MIN_LENGTH = 2;
export const PLAYROOM_HASHTAG_MAX_LENGTH = 8;
export const PLAYROOM_HASHTAG_MAX_COUNT = 9;

/** 한 사용자가 동시에 열어둘 수 있는 플레이룸 개수 상한입니다. */
export const MY_PLAYROOM_MAX_COUNT = 5;

/** 플레이룸 채팅 길이 제한. */
export const PLAYROOM_CHAT_MAX_LENGTH = 100;

/**
 * (메인)
 * 플레이룸 노출 개수. 라이브 목록 조회 limit 으로도 그대로 씁니다.
 */
export const MAIN_PLAYROOM_COUNT = 3;
