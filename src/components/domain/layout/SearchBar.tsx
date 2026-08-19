'use client';

import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Serach from '@/assets/icons/Search.svg';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = cva(
    'bg-bg-card text-text-primary flex rounded-full py-2 pr-3 pl-4 border transition-border duration-300',
    {
      variants: {
        isFocused: {
          true: 'border-primary',
          false: 'border-transparent',
        },
      },
    },
  );

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={inputStyle({ isFocused })}>
      <input
        className="w-full bg-transparent text-sm outline-none"
        placeholder="플레이리스트, 그룹 검색"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch();
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      ></input>
      <button className="shrink-0 cursor-pointer" onClick={handleSearch}>
        <Serach />
      </button>
    </div>
  );
}
