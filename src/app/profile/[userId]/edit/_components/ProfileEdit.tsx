'use client';

import Image from 'next/image';
import { type ChangeEvent, type SubmitEvent, useRef, useState } from 'react';

import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';

type ProfileEditPageProps = {
  profileId: number;
};

export default function ProfileEditPage({ profileId }: ProfileEditPageProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState('JPOP의 신');
  const [bio, setBio] = useState('자기 소개입니다');

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
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

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-8">
        <div className="flex justify-center pt-4">
          <div className="relative">
            <Button
              variant="primary"
              size="md"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="프로필"
                  className="size-full object-cover"
                />
              ) : null}
            </Button>

            <IconButton variants="primary" size="md">
              +
            </IconButton>

            <Input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            ></Input>
          </div>
        </div>
      </form>
    </div>
  );
}
