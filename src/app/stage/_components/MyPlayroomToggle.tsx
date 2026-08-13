'use client';

import Toggle from '@/components/Toggle';

type MyPlayroomToggleProps = {
  // true 면 내가 만든 플레이룸만, false 면 전체 라이브 목록을 봅니다.
  isMineOnly: boolean;
  onChange: (isMineOnly: boolean) => void;
};

/** 전체 라이브 목록과 내가 만든 플레이룸 목록을 오가는 토글입니다. */
export default function MyPlayroomToggle({
  isMineOnly,
  onChange,
}: MyPlayroomToggleProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-end py-3">
      <Toggle
        checked={isMineOnly}
        onChange={onChange}
        checkedLabel="내 플레이룸"
        uncheckedLabel="전체"
        ariaLabel="내가 만든 플레이룸만 보기 토글 버튼"
      />
    </div>
  );
}
