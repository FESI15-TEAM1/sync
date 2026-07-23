'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import PlaylistCard from '@/components/domain/PlaylistCard';
import Input from '@/components/Input';

export default function TestPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <h1>안녕 세상아?</h1>

      <Button isDisabled={false} onClick={() => {}}>
        버튼이야
      </Button>

      <PlaylistCard title={'아냐 포져가 만든 플레이리스트'} trackCount={1} />

      <Input
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        value={inputValue}
      />
    </>
  );
}
