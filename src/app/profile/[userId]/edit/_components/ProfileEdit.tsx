'use client';

import { useRouter } from 'next/navigation';
import {
  type ChangeEvent,
  type SubmitEvent,
  useRef,
  useState,
} from 'react';

import PencilIcon from '@/assets/icons/pencil.svg';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import { useUserStore } from '@/providers/user-store-provider';
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

    if (avatarFile) {
      alert(
        '이미지 업로드 API가 아직 없어 프로필 사진은 저장되지 않습니다. 닉네임·자기소개만 저장합니다.',
      );
    }

    setIsSubmitting(true);
    try {
      const updated = await updateMe({
        nickname: nickname.trim(),
        description: bio.trim(),
      });

      setUser({
        id: updated.id,
        nickname: updated.nickname,
        image: updated.image,
      });
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

  //회원 탈퇴
  const handleWithDraw = () => {
    console.log('회원탈퇴 계정', profile.id);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-8">
        <div className="flex justify-center pt-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="bg-bg-card size-48 overflow-hidden rounded-full"
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
              ) : null}
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

          <button
            type="button"
            onClick={handleWithDraw}
            className="self-end text-sm text-red-400"
          >
            회원탈퇴
          </button>
        </div>
      </form>
    </div>
  );
}
