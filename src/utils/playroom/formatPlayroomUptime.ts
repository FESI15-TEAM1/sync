const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/** 갓 만들어진 방과 오래 돌아가는 방의 문구가 달라지는 기준(분). */
const JUST_STARTED_MINUTES = 10;

/**
 * 플레이룸이 생성된 뒤 얼마나 지났는지를 카드에 쓸 문구로 만듭니다.
 * - 10분 미만: `?분 전에 재생 시작함`
 * - 10분 이상: `?분 동안 재생중`
 * - 1시간 이상: `?시간 째 재생중`
 * - 2시간 이상: `?시간 째 재생중...`
 * - 24시간 이상: `하루 전에 개설함`
 * - 48시간 이상: `이틀 전에 개설함;`
 * - 72시간 이상: `?일 째 재생중;;`
 *
 * 시계 오차 등으로 미래 시각이 오면 0분으로 봅니다.
 */
export function formatPlayroomUptime(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) return '';

  const elapsed = Math.max(Date.now() - createdTime, 0);
  const minutes = Math.floor(elapsed / MINUTE);
  const hours = Math.floor(elapsed / HOUR);
  const days = Math.floor(elapsed / DAY);

  if (days >= 3) return `${days}일 째 재생중;;`;
  if (days === 2) return '이틀 전에 개설함;';
  if (days === 1) return '하루 전에 개설함';
  if (hours >= 2) return `${hours}시간 째 재생중...`;
  if (hours >= 1) return `${hours}시간 째 재생중`;
  if (minutes >= JUST_STARTED_MINUTES) return `${minutes}분 동안 재생중`;
  if (minutes < 1) return '방금 재생 시작함';

  return `${minutes}분 전에 재생 시작함`;
}
