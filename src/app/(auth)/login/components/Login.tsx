'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { getEmailError, getPasswordError } from '@/lib/auth-validation';
import { useUserStore } from '@/providers/user-store-provider';

import { loginAction } from '../actions';

export default function LoginForm() {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await loginAction(formData);

      if (!result.success) {
        alert(result.message);
        return;
      }

      if (result.user) {
        setUser(result.user);
      }

      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <form action={handleSubmit} className="flex flex-col gap-1">
        <InputField>
          <InputField.Label>이메일</InputField.Label>

          <InputField.Input
            name="email"
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
            name="password"
            value={password}
            onChange={(e) => {
              const value = e.target.value;

              setPassword(value);
              setPasswordError(getPasswordError(value));
            }}
          />

          <InputField.Error>{passwordError}</InputField.Error>
        </InputField>

        <Button
          type="submit"
          isDisabled={
            !email ||
            !password ||
            !!emailError ||
            !!passwordError ||
            isSubmitting
          }
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
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
    </div>
  );
}
