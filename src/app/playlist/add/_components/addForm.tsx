'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useState } from 'react';

import AddedTracksSection from '@/app/playlist/add/_components/AddedTracksSection';
import PlaylistThumbnailField from '@/app/playlist/add/_components/PlaylistThumbnailField';
import TrackSearchSection from '@/app/playlist/add/_components/TrackSearchSection';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
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
  const [form, setForm] = useState<CreatePlaylistRequest>({
    title: '',
    description: '',
    image: '',
    isPublic: true,
    tracks: [],
  });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const addedVideoIds = new Set(form.tracks.map((track) => track.videoId));

  const handleAddTrack = (track: PlaylistTrack) => {
    setForm((prev) => ({ ...prev, tracks: [...prev.tracks, track] }));
  };
  const handleDeleteTrack = (track: PlaylistTrack) => {
    setForm((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((item) => item.videoId !== track.videoId),
    }));
  };
  const handleReorderTracks = (tracks: PlaylistTrack[]) => {
    setForm((prev) => ({ ...prev, tracks }));
  };
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let image = form.image;

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
        image = fileUrl;
      }
      await postPlaylist({ ...form, image });
      router.push('/playlist');
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 400) {
          alert(error.message);
        }
        if (error.status === 401) {
          router.replace('/login');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-4xl flex-col items-center gap-6"
    >
      <div className="flex w-full">
        <BackButton type="button" fallbackUrl="/playlist" />
      </div>

      <fieldset disabled={isSubmitting} className="contents">
        <PlaylistThumbnailField onFileSelect={setImgFile} />

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
          <InputField.Error>
            {form.title.trim() ? '' : '플레이리스트 이름은 필수입니다.'}
          </InputField.Error>
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
          <label className="ml-2 text-base font-bold text-white">
            공개여부
          </label>
          <Toggle
            checked={form.isPublic}
            onChange={(isPublic) => setForm((prev) => ({ ...prev, isPublic }))}
          />
        </div>

        <TrackSearchSection
          addedVideoIds={addedVideoIds}
          onAddTrack={handleAddTrack}
        />

        <AddedTracksSection
          tracks={form.tracks}
          onReorder={handleReorderTracks}
          onRemoveTrack={handleDeleteTrack}
        />
      </fieldset>

      <Button
        type="submit"
        className="w-full"
        isDisabled={isSubmitting || !form.title.trim()}
      >
        {isSubmitting ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  );
}
