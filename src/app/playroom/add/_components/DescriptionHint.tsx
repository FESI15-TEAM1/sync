'use client';

import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';

import InfoIcon from '@/assets/icons/information.svg';
import Badge from '@/components/domain/playroom/Badge';

function HintBox() {
  const hashtagExampleStyle = 'whitespace-nowrap text-text-primary';

  return (
    <div className="bg-bg-card border-border absolute left-16 z-10 w-auto max-w-122 rounded-xl border p-3 break-keep shadow-xl">
      <p className="text-text-secondary text-left text-sm">
        내용에서 <span className={hashtagExampleStyle}>해시태그(#)</span>를
        사용해 플레이룸 목록에서 보이는{' '}
        <span className={hashtagExampleStyle}>뱃지</span>를 생성해보세요!{' '}
        <span className={hashtagExampleStyle}>#장르</span>{' '}
        <span className={hashtagExampleStyle}>#힐링</span> 이런식으로 작성하면,{' '}
        <span className={hashtagExampleStyle}>플레이룸 목록의 항목 하단</span>에
        아래처럼 나타나요! 최소 2글자, 최대 8글자로 작성할 수 있고, 최대 9개의
        뱃지를 생성할 수 있어요!
      </p>
      <div className="mt-2 flex gap-2">
        <Badge type="genre">장르</Badge>
        <Badge type="genre">힐링</Badge>
      </div>
    </div>
  );
}

export default function DescriptionHint() {
  const hintRef = useRef<HTMLDivElement>(null);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const hintIconStyle = cva('hover:text-text-primary size-5', {
    variants: {
      isHintOpen: {
        true: 'text-text-primary',
        false: 'text-text-secondary',
      },
    },
  });

  // 힌트 박스 외부를 클릭하면 닫히게~
  useEffect(() => {
    if (!isHintOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!hintRef.current?.contains(e.target as Node)) {
        setIsHintOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHintOpen]);

  return (
    <div className="relative flex gap-1" ref={hintRef}>
      <label className="text-text-primary ml-2 text-base font-bold">내용</label>
      <button
        type="button"
        className="cursor-pointer"
        aria-expanded={isHintOpen}
        aria-label="해시태그 힌트"
        onClick={() => setIsHintOpen((prev) => !prev)}
      >
        <InfoIcon className={hintIconStyle({ isHintOpen })} />
      </button>
      {isHintOpen && <HintBox />}
    </div>
  );
}
