'use client';

import {
  type ChangeEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import PencilIcon from '@/assets/icons/pencil.svg';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import { getMe } from '@/services/user/user.api';

type ProfileEditPageProps = {
  profileId: number;
};

export default function ProfileEditPage({ profileId }: ProfileEditPageProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((me) => {
        if (cancelled) return;
        if (me.id !== profileId) return;

        setNickname(me.nickname);
        setBio(me.description ?? '');
        setAvatarPreview(me.image);
      })
      .catch(() => {
        // 로드 실패 시 빈 폼 유지
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      profileId,
      nickname,
      bio,
      hasAvatar: Boolean(avatarPreview),
    });
  };

  //회원 탈퇴
  const handleWithDraw = () => {
    console.log('회원탈퇴 계정', profileId);
  };

  if (isLoading) {
    return (
      <div className="text-text-secondary mx-auto flex w-full max-w-md flex-1 items-center justify-center px-5 py-8">
        불러오는 중...
      </div>
    );
  }

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
          <Button type="submit" variant="primary" size="lg" className="w-full">
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
