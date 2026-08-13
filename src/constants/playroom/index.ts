/**
 * 방 제목·설명 길이 제한. 백엔드 스펙(PlayroomUpdateRequest)과 동일한 값입니다.
 *
 * 사용처: src/app/playroom/[playroomId]/_components/PlayroomEditModal.tsx
 */
export const PLAYROOM_TITLE_MAX_LENGTH = 100;
export const PLAYROOM_DESCRIPTION_MAX_LENGTH = 500;

/** 한 사용자가 동시에 열어둘 수 있는 플레이룸 개수 상한입니다. */
export const MY_PLAYROOM_MAX_COUNT = 5;
