'use client';

import { useSearchParams } from 'next/navigation';

import SearchBar from '@/components/domain/layout/SearchBar';

import { useGetSearchDataQuery } from '../_hooks/useSearchHooks';
import SearchGroupList from './SearchGroupList';
import SearchPlaylistCarousel from './SearchPlaylistCarousel';
import SearchPlayroomList from './SearchPlayroomList';

export default function SearchForm() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const { data, isPending, error } = useGetSearchDataQuery({ q });
  const { playlists, groups, playrooms } = data ?? {};

  if (error) return <div>에러발생</div>;

  const hasResults =
    (playlists?.items.length ?? 0) > 0 ||
    (groups?.items.length ?? 0) > 0 ||
    (playrooms?.items.length ?? 0) > 0;

  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <SearchBar />
      {isPending ? (
        <div className="text-text-primary flex min-h-[60vh] w-full items-center justify-center font-bold">
          로딩중..
        </div>
      ) : !data || !hasResults ? (
        <div className="text-text-primary flex min-h-[60vh] w-full items-center justify-center font-bold">
          검색된 내용을 찾을 수 없습니다.
        </div>
      ) : (
        <>
          {!playlists?.items || playlists.items.length < 1 ? (
            ''
          ) : (
            <>
              <span className="text-text-primary w-full font-bold">
                PlayList
              </span>
              <SearchPlaylistCarousel items={playlists?.items ?? []} />
            </>
          )}

          {!playrooms?.items || playrooms.items.length < 1 ? (
            ''
          ) : (
            <>
              <span className="text-text-primary font-bold">Live</span>
              <div>
                <SearchPlayroomList data={playrooms?.items ?? []} />
              </div>
            </>
          )}

          {!groups?.items || groups.items.length < 1 ? (
            ''
          ) : (
            <>
              <span className="text-text-primary font-bold">Group</span>
              <div>
                <SearchGroupList data={groups?.items ?? []} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
