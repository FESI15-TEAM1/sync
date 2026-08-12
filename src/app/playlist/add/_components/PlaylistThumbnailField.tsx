'use client';

import Image from 'next/image';
import { type ChangeEvent, useState } from 'react';

import IconButton from '@/components/IconButton';

export default function PlaylistThumbnailField({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    onFileSelect(file);
  };

  return (
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
            className="overflow-hidden rounded-2xl object-cover p-2"
          />
        ) : null}
      </label>
      <input
        id="thumbnail"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <IconButton
        variants="primary"
        size="sm"
        className="text-text-primary absolute -right-2 -bottom-2"
      >
        +
      </IconButton>
    </div>
  );
}
