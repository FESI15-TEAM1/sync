'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type SubmitEvent } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { getEmailError, getPasswordError } from '@/lib/auth-validation';

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
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const handleCheckNickname = () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      setIsNicknameValid(false);
      return;
    }

    setNicknameError('');
    setIsNicknameValid(true);
  };

  const handleCheckEmail = () => {
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      setIsEmailValid(false);
      return;
    }

    const error = getEmailError(email);
    if (error) {
      setEmailError(error);
      setIsEmailValid(false);
      return;
    }

    setEmailError('');
    setIsEmailValid(true);
    setIsVerificationSent(true);
  };

  const handleVerifyCode = () => {
    if (!verificationCode.trim()) {
      setVerificationCodeError('인증코드를 입력해주세요.');
      setIsCodeValid(false);
      return;
    }

    setVerificationCodeError('');
    setIsCodeValid(true);
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

    if (!isCodeValid) {
      setVerificationCodeError('이메일 인증을 완료해주세요');
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
          <InputField
            onButtonClick={handleCheckNickname}
            isButtonDisabled={!nickname}
            buttonLabel="중복확인"
            label="닉네임"
            errorMessage={nicknameError}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <InputField
            onButtonClick={handleCheckEmail}
            isButtonDisabled={!email}
            buttonLabel="이메일 인증"
            label="이메일"
            errorMessage={emailError}
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setEmailError(getEmailError(value));
            }}
          />
          {isVerificationSent ? (
            <InputField
              onButtonClick={handleVerifyCode}
              isButtonDisabled={!verificationCode}
              buttonLabel="인증코드 확인"
              label="인증코드"
              placeholder="인증코드 6자리"
              errorMessage={verificationCodeError}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          ) : null}
          <InputField
            label="비밀번호"
            errorMessage={passwordError}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordError(getPasswordError(value));
            }}
          />
          <InputField
            label="비밀번호 확인"
            errorMessage={passwordConfirmError}
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);
              setPasswordConfirmError(getPasswordError(value));
            }}
          />
          <div className="w-full">
            <Button
              type="submit"
              size="md"
              variant="primary"
              isDisabled={
                !isNicknameValid ||
                !isEmailValid ||
                !isCodeValid ||
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
