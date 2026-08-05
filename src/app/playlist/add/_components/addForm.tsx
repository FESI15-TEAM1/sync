'use client';

import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';

import {
  isYoutubeVideoItem,
  type YoutubeSearchResponse,
} from '@/app/api/youtube/youtube.types';
import Minus from '@/assets/icons/minus.svg';
import Button from '@/components/Button';
import TrackList from '@/components/domain/playlists/TrackList';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import Toggle from '@/components/Toggle';
import { APIError } from '@/lib/http/error';
import type {
  CreatePlaylistRequest,
  PlaylistTrack,
} from '@/services/playlist/playlist';
import { postPlaylist } from '@/services/playlist/playlist.api';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

export default function AddForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePlaylistRequest>({
    title: '',
    description: '',
    image: '',
    isPublic: true,
    tracks: [],
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchList, setSearchList] = useState<PlaylistTrack[]>([]);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const router = useRouter();

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImgFile(file);
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const fetchSearchData = async () => {
    const data = await fetch(`/api/youtube/searchTrack?q=${searchValue}`);
    const result: YoutubeSearchResponse = await data.json();
    const videos = result.items.filter(isYoutubeVideoItem).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
    console.log(videos);
    setSearchList(videos);
  };
  const handleAddTrack = (track: PlaylistTrack) => {
    setForm((prev) => ({ ...prev, tracks: [...prev.tracks, track] }));
    setSearchList((prev) =>
      prev.filter((item) => item.videoId !== track.videoId),
    );
  };
  const handleDeleteTrack = (track: PlaylistTrack) => {
    setForm((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((item) => item.videoId !== track.videoId),
    }));
  };
  const handleSubmit = async () => {
    try {
      if (imgFile) {
        const { uploadUrl, fileUrl } = await requestUploadUrl({
          domain: 'playlist',
          contentType: imgFile.type as UploadUrlRequest['contentType'],
        });
        const putResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': imgFile.type },
          body: imgFile,
        });
        if (!putResponse.ok) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        const finalForm = { ...form, image: fileUrl };
        setForm(finalForm);

        console.log(finalForm);
        postPlaylist(finalForm);
        router.push('/playlist');
      }
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 400) {
          alert(error.message);
        }
        if (error.status === 401) {
          redirect('/login');
        }
      }
    }
  };

  return (
    <div className="flex w-4xl flex-col items-center gap-6">
      {/* 이미지 색션 */}
      <div className="relative h-40 w-40">
        <label
          htmlFor="thumbnail"
          className="border-border bg-bg-primary flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border"
        >
          {preview ? (
            <Image
              src={preview ? preview : form.image}
              alt="플레이리스트 썸네일"
              fill
              className="overflow-hidden rounded-2xl object-cover p-2"
            />
          ) : null}
        </label>
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <IconButton
          variants="primary"
          size="sm"
          className="text-text-primary absolute -right-2 -bottom-2"
        >
          +
        </IconButton>
      </div>

      {/* 플레이리스트 이름 색션 */}
      <InputField className="w-full">
        <InputField.Label>플레이리스트 이름 </InputField.Label>
        <InputField.Input
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="플레이리스트 이름을 입력하세요"
        ></InputField.Input>
      </InputField>

      <Textarea
        label="플레이리스트 설명"
        value={form.description}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder={`공부할때 들으면 집중 잘되는 노래들로 모아봤습니다.\n비슷한 취향있으신 분은 좋아요 그룹생성 요청 눌러주세요!`}
      />
      <div className="flex w-full flex-col gap-1">
        <label className="ml-2 text-base font-bold text-white">공개여부</label>
        <Toggle
          checked={form.isPublic}
          onChange={(isPublic) => setForm((prev) => ({ ...prev, isPublic }))}
        />
      </div>
      {/* 검색 색션 */}
      <div className="flex w-full items-center justify-center gap-3">
        <InputField className="w-full">
          <InputField.Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="아티스트 명 또는 곡 이름을 검색하세요."
          ></InputField.Input>
          <InputField.Button onClick={fetchSearchData}>검색</InputField.Button>
        </InputField>
      </div>
      {searchList.length > 0 ? (
        <>
          <span className="text-text-secondary">검색결과</span>
          {/* 검색 결과 색션 */}
          <div className="bg-bg-card w-full rounded-xl p-2">
            <TrackList
              trackList={searchList}
              onTrackClick={handleAddTrack}
              Button={
                <IconButton
                  className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm"
                  size="sm"
                >
                  +
                </IconButton>
              }
            />
          </div>
        </>
      ) : (
        ''
      )}
      {/* 추가된곡 색션 */}
      <span className="text-text-secondary">추가된곡</span>
      <div className="w-full">
        <TrackList
          trackList={form?.tracks}
          onTrackClick={handleDeleteTrack}
          Button={
            <IconButton
              className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm"
              size="sm"
            >
              <Minus color="text-text-secondary" />
            </IconButton>
          }
        />
      </div>
      <Button className="w-full" onClick={handleSubmit}>
        저장하기
      </Button>
    </div>
  );
}
