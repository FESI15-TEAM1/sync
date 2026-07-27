'use client';

import Image from 'next/image';
import { type ChangeEvent, useState } from 'react';

import Button from '@/components/Button';
import Track from '@/components/domain/Track';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';

export default function AddForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <div className="relative h-40 w-40">
        <label
          htmlFor="thumbnail"
          className="border-border bg-bg-primary flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border"
        >
          {preview ? (
            <Image
              src={preview}
              alt="플레이리스트 썸네일"
              fill
              unoptimized
              className="overflow-hidden rounded-2xl object-cover p-2"
            />
          ) : null}
        </label>
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <IconButton
          variants="primary"
          size="sm"
          className="absolute -right-2 -bottom-2"
        >
          +
        </IconButton>
      </div>
      <Input
        label="플레이리스트이름"
        width={'100%'}
        value=""
        onChange={(e) => e.target}
        placeholder="플레이리스트 이름을 입력하세요"
      />
      <Textarea
        label="플레이리스트 설명"
        width={'100%'}
        value=""
        onChange={(e) => e.target}
      />
      <div className="flex items-center justify-center">
        <Input width={'100%'} value="" onChange={(e) => e.target} />{' '}
        <Button size="sm" isDisabled={false}>
          검색
        </Button>
      </div>
      <span className="text-text-secondary">검색결과</span>
      <div>
        <div>
          <Track
            videoId="1"
            title="greywindow"
            artist="kilo NOva"
            Button={
              <Button size="sm" className={'flex-none'}>
                추가
              </Button>
            }
          />
        </div>
        <Track title="S0S" artist="tuki[17]" videoId="1" />
        <Track title="브레인워시" artist="CJam X BlackNuts" videoId="2" />
      </div>
      <span className="text-text-secondary">추가된곡</span>
      <div>
        <Track title="S0S" artist="tuki[17]" videoId="1" />
        <Track title="브레인워시" artist="CJam X BlackNuts" videoId="2" />
      </div>
    </div>
  );
}
