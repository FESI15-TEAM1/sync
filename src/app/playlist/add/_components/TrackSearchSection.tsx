'use client';

import { useState } from 'react';

import { useYoutubeSearchTracks } from '@/app/playlist/add/_hooks/useYoutubeSearchTracks';
import Button from '@/components/Button';
import TrackList, {
  TrackListSkeleton,
} from '@/components/domain/playlists/TrackList';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import type { PlaylistTrack } from '@/services/playlist/playlist';

export default function TrackSearchSection({
  addedVideoIds,
  onAddTrack,
}: {
  addedVideoIds: Set<string>;
  onAddTrack: (track: PlaylistTrack) => void;
}) {
  const [searchValue, setSearchValue] = useState('');
  const {
    tracks: searchList,
    page,
    hasNextPage,
    hasPrevPage,
    hasSearched,
    goToNextPage,
    goToPrevPage,
    search,
    isLoading: isSearching,
    searchError,
  } = useYoutubeSearchTracks(addedVideoIds);

  const handleSearch = () => {
    if (searchValue) search(searchValue);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center gap-3">
        <InputField className="w-full">
          <InputField.Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              handleSearch();
            }}
            placeholder="아티스트 명 또는 곡 이름을 검색하세요."
          ></InputField.Input>
          <InputField.Button onClick={handleSearch} disabled={!searchValue}>
            검색
          </InputField.Button>
        </InputField>
      </div>
      {searchError ? (
        <p className="w-full text-sm text-red-500">{searchError}</p>
      ) : null}
      {hasSearched ? (
        <>
          <span className="text-text-secondary">검색결과</span>
          {searchList.length > 0 ? (
            <div className="bg-bg-card w-full rounded-xl p-2">
              <TrackList
                trackList={searchList}
                onTrackClick={onAddTrack}
                Button={
                  <IconButton
                    type="button"
                    className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm"
                    size="sm"
                  >
                    +
                  </IconButton>
                }
              />
            </div>
          ) : (
            <span className="text-text-secondary">
              이 페이지에는 표시할 결과가 없습니다.
            </span>
          )}
          <div className="flex w-full items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={!hasPrevPage}
              onClick={goToPrevPage}
            >
              이전
            </Button>
            <span className="text-text-secondary text-sm">{page + 1}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={!hasNextPage || isSearching}
              onClick={goToNextPage}
            >
              다음
            </Button>
          </div>
        </>
      ) : isSearching ? (
        <div className="bg-bg-card w-full rounded-xl p-2">
          <TrackListSkeleton />
        </div>
      ) : (
        ''
      )}
    </>
  );
}
