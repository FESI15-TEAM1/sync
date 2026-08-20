import { useEffect, useRef, useState } from 'react';

// 복사 완료 토스트를 띄워두는 시간
const COPY_TOAST_DURATION_MS = 2000;

export function useCopyInviteCode(inviteCode: string | null | undefined) {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copyErrorMessage, setCopyErrorMessage] = useState<string | null>(
    null,
  );
  const copyToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (copyToastTimerRef.current) clearTimeout(copyToastTimerRef.current);
    };
  }, []);

  const handleCopyInviteCode = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      //복사 성공
      setCopyErrorMessage(null);
      setShowCopyToast(true);

      //기존 타이머 제거
      if (copyToastTimerRef.current) {
        clearTimeout(copyToastTimerRef.current);
      }
      //일정 시간 후 토스트 숨기기
      copyToastTimerRef.current = setTimeout(() => {
        setShowCopyToast(false);
      }, COPY_TOAST_DURATION_MS);
    } catch {
      //복사 실패
      setCopyErrorMessage('초대코드 복사에 실패했습니다. 직접 복사해주세요.');
      setShowCopyToast(false);
    }
  };

  return { showCopyToast, copyErrorMessage, handleCopyInviteCode };
}
