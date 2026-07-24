'use client';

import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { getEmailError, getPasswordError } from '@/lib/auth-validation';
import { type SubmitEvent } from 'react';

export default function Signup() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleCheckNickname = () => {
    if (!nickname.trim) {
      setNickname('닉네임을 입력해주세요.');
      setIsNicknameValid(false);
      return;
    }
  };

  const handleCheckEmail = () => {
    if (!email.trim) {
      setEmailError('이메일을 입력해주세요.');
      setIsEmailValid(false);
      return;
    }
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isNicknameValid) {
      setNicknameError('닉네임 중복확인을 해주세요');
      return;
    }

    if (!isEmailValid) {
      setEmailError('이메일 형식을 확인해주세요');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다');
      return;
    }
  };

  return (
    <main className="bg-bg-primary flex min-h-screen w-full flex-1 justify-center px-5 py-10">
      <div className="flex w-full max-w-md flex-col">
        <div className="mb-8">
          <h1 className="text-primary text-5xl font-bold">Sync</h1>
          <p className="text-text-secondary mt-6 text-base leading-relaxed">
            몇 초면 가입 완료
          </p>

          <p className="text-text-secondary mt-2 text-base leading-relaxed">
            지금 바로 그룹을 만들어보세요.
          </p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex items-end gap-3">
            <Input
              label="닉네임"
              errorMessage={nicknameError}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              width="100%"
            />
            <div className="w-30 shrink-0">
              <Button
                onClick={handleCheckNickname}
                isDisabled={!nickname}
                size="md"
                variant="primary"
              >
                중복확인
              </Button>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <Input
              label="이메일"
              errorMessage={emailError}
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                setEmailError(getEmailError(value));
              }}
              width="100%"
            />
            <div className="w-30 shrink-0">
              <Button
                onClick={handleCheckEmail}
                isDisabled={!email}
                size="md"
                variant="primary"
              >
                이메일 인증
              </Button>
            </div>
          </div>
          {/* {isVerificationSent? (<div className="flex items-end gap-3">
                <Input label="인증코드" placeholder="인증코드 6자리" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                <div className="w-30">
                    <Button size="md" variant="primary" isDisabled={!verificationCode} onClick={handleVerifyCode}>인증코드 받기</Button>
                </div>
            </div>) : null} */}
          <Input
            label="비밀번호"
            errorMessage={passwordError}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordError(getPasswordError(value));
            }}
            width="100%"
          />
          <Input
            label="비밀번호 확인"
            errorMessage={passwordConfirmError}
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);
              setPasswordConfirmError(getPasswordError(value));
            }}
            width="100%"
          />
          <div className="w-full">
            <Button
              size="md"
              variant="primary"
              isDisabled={
                !isNicknameValid ||
                !isEmailValid ||
                password !== confirmPassword
              }
            >
              회원가입
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-white">
          이미 계정이 있으신가요?
        </p>
        <Link href="/login" className="text-primary mt-4 text-center text-sm">
          로그인
        </Link>
      </div>
    </main>
  );
}
