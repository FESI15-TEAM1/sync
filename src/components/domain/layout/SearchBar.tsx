'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Serach from '@/assets/icons/Search.svg';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSaearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative flex w-full">
      <input
        className="bg-bg-card text-text-primary w-full rounded-full px-6 py-2"
        placeholder="검색어 를 입력해 주세요"
        onChange={(e) => setQuery(e.target.value)}
      ></input>
      <button className="absolute top-2 right-4" onClick={handleSaearch}>
        <Serach />
      </button>
    </div>
  );
}
