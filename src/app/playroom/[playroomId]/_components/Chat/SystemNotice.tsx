import { type SystemNoticeTypes } from '../Playroom';

/** 입·퇴장 안내 문구. 방장은 재생 동기화와 직결되므로 따로 알립니다. */
function getNoticeText(notice: SystemNoticeTypes, isHost: boolean) {
  const name = isHost ? `방장 ${notice.nickname}님` : `${notice.nickname}님`;

  if (notice.type === 'left') {
    return isHost
      ? `${name}이 나갔습니다. 재생이 멈출 수 있습니다.`
      : `${name}이 나갔습니다.`;
  }

  return notice.isRejoin
    ? `${name}이 다시 참여하였습니다.`
    : `${name}이 참여하였습니다.`;
}

export default function SystemNotice({
  notice,
  isHost,
}: {
  notice: SystemNoticeTypes;
  isHost: boolean;
}) {
  return (
    <p role="status" className="text-text-secondary py-1 text-center text-xs">
      {getNoticeText(notice, isHost)}
    </p>
  );
}
