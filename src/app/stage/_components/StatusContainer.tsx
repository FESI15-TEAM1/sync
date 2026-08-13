import { type ReactNode } from 'react';

/** 목록 대신 로딩·에러·빈 상태 문구를 화면 가운데에 보여주는 영역입니다. */
export default function StatusContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
      {children}
    </div>
  );
}
