'use client';

import Image from 'next/image';
import { type ChangeEvent, useEffect, useState } from 'react';

export default function PlaylistThumbnailField({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  // preview가 바뀌기 직전(다음 파일 선택 시)과 언마운트 시 모두 이전 blob URL을 해제한다.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="relative h-40 w-40">
      <label
        htmlFor="thumbnail"
        aria-label="플레이리스트 썸네일 선택"
        className="border-border bg-bg-primary flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border"
      >
        {preview ? (
          <Image
            src={preview}
            alt="플레이리스트 썸네일"
            fill
            className="overflow-hidden rounded-2xl object-cover p-2"
            unoptimized
          />
        ) : null}
        <span
          aria-hidden="true"
          className="text-text-primary bg-primary absolute -right-2 -bottom-2 flex size-6 items-center justify-center rounded-full"
        >
          +
        </span>
      </label>
      <input
        id="thumbnail"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
