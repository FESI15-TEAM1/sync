'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import SearchBar from '@/components/domain/layout/SearchBar';

export default function Search() {
  const serachParams = useSearchParams();
  const query = serachParams.get('q');

  const handleSearch = async () => {
    if (!query || !query.trim()) {
      console.log('errer');
      return;
    }

    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`, {
        method: 'GET',
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch {}
  };

  useEffect(() => {
    if (!query) return;
    handleSearch();
  }, []);

  return (
    <div>
      <SearchBar />
    </div>
  );
}
