'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type FormEvent } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { getEmailError, getPasswordError } from '@/lib/auth-validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-10">
      <div className="mb-8">
        <h1 className="text-primary text-5xl font-bold">Sync</h1>
        <p className="mt-2 text-base leading-relaxed text-white">
          그룹과 함께 플레이리스트를 나누고 ,<br /> 라이브로 같이 들어보세요.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            setEmailError(getEmailError(value));
          }}
          placeholder="이메일을 입력해주세요."
          width="100%"
          label="이메일"
          errorMessage={emailError}
        />
        <Input
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            setPasswordError(getPasswordError(value));
          }}
          placeholder="비밀번호를 입력해주세요."
          width="100%"
          label="비밀번호"
          type="password"
          errorMessage={passwordError}
        />
        <Button
          size="md"
          variant="primary"
          isDisabled={!email || !password || !!emailError || !!passwordError}
        >
          로그인
        </Button>
      </form>
      <div className="mt-8 flex items-center gap-4">
        <span className="bg-border h-px flex-1"></span>
        <span className="text-text-secondary text-sm">또는</span>
        <span className="bg-border h-px flex-1"></span>
      </div>

      <p className="text-text-primary mt-6 text-center text-sm">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          회원가입
        </Link>
      </p>
    </main>
  );
}
