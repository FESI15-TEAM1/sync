'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

export default function TestPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <h1>안녕 세상아?</h1>

      <Button isDisabled={false} onClick={() => {}}>
        버튼이야
      </Button>

      <Input
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        value={inputValue}
      />
    </>
  );
}
