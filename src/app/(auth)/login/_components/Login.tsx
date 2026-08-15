'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { type SubmitEvent } from 'react';

import Google from '@/assets/images/google-login.png';
import Kakao from '@/assets/images/kakao-login.png';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { getEmailError } from '@/lib/auth-validation';

import { useLoginMutation } from '../_hooks/useLoginMutation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { loginMutate, isSubmitting } = useLoginMutation();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutate({ email, password });
  };

  function handleSocialLogin(provider: 'kakao' | 'google') {
    window.location.href = `/api/auth/login/${provider}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-10">
      <div className="mb-8">
        <h1 className="text-primary text-5xl font-bold">Sync</h1>
        <p className="text-text-secondary mt-6 text-base leading-relaxed">
          그룹과 함께 플레이리스트를 나누고,
        </p>

        <p className="text-text-secondary mt-2 text-base leading-relaxed">
          라이브로 같이 들어보세요.
        </p>
      </div>

      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <InputField>
          <InputField.Label>이메일</InputField.Label>
          <InputField.Input
            type="email"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setEmailError(getEmailError(value));
            }}
          />
          <InputField.Error>{emailError}</InputField.Error>
        </InputField>

        <InputField>
          <InputField.Label>비밀번호</InputField.Label>
          <InputField.Password
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
            }}
          />
        </InputField>

        <Button
          className="mt-6"
          type="submit"
          // isDisabled={!email || !password || !!emailError || !!passwordError}
          isDisabled={isSubmitting}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="mt-8 flex justify-center gap-8">
        <Button
          variant="secondary"
          type="button"
          className="rounded-full p-0"
          onClick={() => handleSocialLogin('google')}
        >
          <Image src={Google} alt="구글 로그인" width={40} height={40} />
        </Button>

        <Button
          variant="secondary"
          type="button"
          className="rounded-full p-0"
          onClick={() => handleSocialLogin('kakao')}
        >
          <Image src={Kakao} alt="카카오 로그인" width={40} height={40} />
        </Button>
      </div>

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
    </div>
  );
}
