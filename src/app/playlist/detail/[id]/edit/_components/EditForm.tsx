'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { type SubmitEvent, useState } from 'react';

import PlaylistThumbnailField from '@/app/playlist/add/_components/PlaylistThumbnailField';
import TrackSearchSection from '@/app/playlist/add/_components/TrackSearchSection';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import ReorderableTrackList from '@/components/domain/playlists/ReorderableTrackList';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import Toggle from '@/components/Toggle';
import { clientFetch } from '@/lib/http/client-fetch';
import { APIError } from '@/lib/http/error';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';
import type {
  PlaylistTrack,
  UpdatePlaylistRequest,
} from '@/services/playlist/playlist';
import { updatePlaylist } from '@/services/playlist/playlist.api';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

export default function EditForm() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: playlist,
    isPending,
    error,
  } = useQuery({
    queryKey: ['playlists', id],
    queryFn: () => clientFetch<PlaylistDetail>(`/playlists/${id}`),
  });

  if (isPending) return <EditFormSkeleton />;
  if (playlist) return <EditPlaylistForm id={id} playlist={playlist} />;

  if (error)
    return (
      <div className="text-text-primary flex min-h-[60vh] w-full items-center justify-center font-bold">
        {error.message}
      </div>
    );
}

function EditFormSkeleton() {
  return (
    <div className="flex w-4xl flex-col items-center gap-6">
      <div className="bg-border size-40 animate-pulse rounded-2xl" />
      <div className="bg-border h-10 w-full animate-pulse rounded-md" />
      <div className="bg-border h-24 w-full animate-pulse rounded-md" />
    </div>
  );
}

function EditPlaylistForm({
  id,
  playlist,
}: {
  id: string;
  playlist: PlaylistDetail;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdatePlaylistRequest>(() => ({
    title: playlist.title,
    description: playlist.description,
    image: playlist.image,
    isPublic: playlist.isPublic,
    tracks: playlist.tracks,
  }));
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      let finalForm = form;

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

        finalForm = { ...form, image: fileUrl };
        setForm(finalForm);
      }

      const updated = await updatePlaylist(id, finalForm);
      queryClient.setQueryData(['playlists', id], updated);
      router.push(`/playlist/detail/${id}`);
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 400) {
          alert(error.message);
        }
        if (error.status === 401) {
          router.push('/login');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-4xl flex-col items-center gap-4"
    >
      <div className="flex w-full">
        <BackButton type="button" fallbackUrl={`/playlist/detail/${id}`} />
      </div>

      <fieldset disabled={isSubmitting} className="contents">
        {/* 이미지 색션 */}
        <PlaylistThumbnailField
          initialImage={form.image}
          onFileSelect={setImgFile}
        />

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

        <div className="mb-4 w-full">
          <Textarea
            label="플레이리스트 설명"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder={`공부할때 들으면 집중 잘되는 노래들로 모아봤습니다.\n비슷한 취향있으신 분은 좋아요 그룹생성 요청 눌러주세요!`}
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <label className="ml-2 text-base font-bold text-white">
            공개여부
          </label>
          <Toggle
            checked={form.isPublic}
            onChange={(isPublic) => setForm((prev) => ({ ...prev, isPublic }))}
            className="mb-4"
          />
        </div>
        {/* 검색 색션 */}
        <TrackSearchSection
          addedVideoIds={addedVideoIds}
          onAddTrack={handleAddTrack}
        />
        {/* 추가된곡 색션 */}
        <span className="text-text-secondary mb-4">추가된곡</span>
        <div className="w-full">
          <ReorderableTrackList
            tracks={form.tracks}
            onReorder={handleReorderTracks}
            onRemoveTrack={handleDeleteTrack}
          />
        </div>
      </fieldset>

      <Button
        type="submit"
        className="mt-4 w-full"
        isDisabled={isSubmitting || !form.title.trim()}
      >
        {isSubmitting ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  );
}
