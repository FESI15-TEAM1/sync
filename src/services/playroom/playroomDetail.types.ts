import { type PlayroomHost } from './playroom.types';

export interface CurrentTrack {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  /** 현재 재생 위치(초) */
  currentTime: number;
  isPlaying: boolean;
}

/** 방장(host)과 동일한 유저 요약 스키마(UserSummaryResponse)입니다. */
type PlayroomMember = PlayroomHost;

/** 방 정보 수정 요청. 보낸 필드는 통째로 교체되고, 생략한 필드는 그대로 유지됩니다. */
export interface PlayroomUpdateRequest {
  title: string;
  description?: string;
  // 빈 배열을 보내면 해시태그가 제거됩니다.
  hashtags?: string[];
}

export interface PlayroomDetailResponse {
  id: number;
  title: string;
  description: string;
  hashtags: string[];
  isLive: boolean;
  // 비회원이면 항상 false 입니다.
  isHost: boolean;
  host: PlayroomHost;
  listenerCount: number;
  playlistId: number;
  // 방장이 재생을 시작하기 전에는 null 입니다.
  currentTrack: CurrentTrack | null;
  // WebSocket 접속 중인 유저만 담기므로 아무도 없으면 빈 배열입니다.
  members: PlayroomMember[];
  createdAt: string;
}
