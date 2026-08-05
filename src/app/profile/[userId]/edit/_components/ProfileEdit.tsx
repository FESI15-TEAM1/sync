'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, type SubmitEvent, useRef, useState } from 'react';

import PencilIcon from '@/assets/icons/pencil.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import { useUserStore } from '@/providers/user-store-provider';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';
import { updateMe } from '@/services/user/user.api';
import type { MyProfile } from '@/services/user/user.types';

type ProfileEditPageProps = {
  profile: MyProfile;
};

export default function ProfileEditPage({ profile }: ProfileEditPageProps) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.image,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.description ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let image: string | undefined;

      if (avatarFile) {
        const { uploadUrl, fileUrl } = await requestUploadUrl({
          domain: 'profile',
          contentType: avatarFile.type as UploadUrlRequest['contentType'],
        });

        const putResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': avatarFile.type },
          body: avatarFile,
        });
        if (!putResponse.ok) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        image = fileUrl;
      }

      const updated = await updateMe({
        nickname: nickname.trim(),
        description: bio.trim(),
        ...(image ? { image } : {}),
      });

      setUser(updated);
      router.push(`/profile/${updated.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-8">
        <div className="flex justify-center pt-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="bg-bg-card flex size-48 items-center justify-center overflow-hidden rounded-full"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL 및 가변 CDN
                <img
                  src={avatarPreview}
                  alt="프로필"
                  width={192}
                  height={192}
                  className="size-full object-cover"
                />
              ) : (
                <SyncLogo width={80} height={80} />
              )}
            </button>

            <IconButton
              type="button"
              variants="primary"
              size="lg"
              onClick={() => avatarInputRef.current?.click()}
              className="text-text-primary absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full text-lg opacity-90 shadow-md transition-opacity"
              aria-label="프로필 사진 변경"
            >
              <PencilIcon />
            </IconButton>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <InputField>
            <InputField.Label>닉네임</InputField.Label>
            <InputField.Input
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </InputField>

          <Textarea
            label="자기소개"
            placeholder="자기소개를 입력하세요"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="flex flex-1 flex-col justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isDisabled={isSubmitting || !nickname.trim()}
          >
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
}
