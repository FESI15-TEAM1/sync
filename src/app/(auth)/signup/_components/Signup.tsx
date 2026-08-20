'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { type SubmitEvent } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import {
  getEmailError,
  getNicknameError,
  getPasswordError,
} from '@/lib/auth-validation';
import {
  confirmEmailVerification,
  requestEmailVerification,
  signup,
} from '@/services/auth/auth.api';

import { useCheckNicknameMutation } from '../_hooks/useCheckNicknameMutation';

export default function Signup() {
  const router = useRouter();
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

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { checkNicknameMutate, isCheckingNickname } =
    useCheckNicknameMutation();

  // 확인 응답이 오는 사이 닉네임이 바뀌었는지 비교하기 위한 최신값 참조
  const nicknameRef = useRef(nickname);

  const handleCheckNickname = async () => {
    if (isCheckingNickname) return;

    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      setIsNicknameValid(false);
      return;
    }

    const lengthError = getNicknameError(nickname);
    if (lengthError) {
      setNicknameError(lengthError);
      setIsNicknameValid(false);
      return;
    }

    const nicknameAtRequest = nickname;
    try {
      const { available } = await checkNicknameMutate(nicknameAtRequest);
      // 응답을 받는 사이 닉네임이 바뀌었다면 이 응답은 버립니다.
      if (nicknameRef.current !== nicknameAtRequest) return;

      if (available) {
        setNicknameError('');
        setIsNicknameValid(true);
        alert('사용 가능한 닉네임입니다.');
      } else {
        setNicknameError('이미 사용 중인 닉네임입니다.');
        setIsNicknameValid(false);
      }
    } catch (error) {
      if (nicknameRef.current !== nicknameAtRequest) return;
      setIsNicknameValid(false);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleCheckEmail = async () => {
    if (isSendingCode) return;

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

    //인증코드 발송
    setIsSendingCode(true);
    try {
      await requestEmailVerification(email);

      setIsCodeSent(true);

      alert('인증 코드를 발송했습니다.');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await confirmEmailVerification(email, verificationCode);

      setIsCodeValid(true);
      setIsEmailVerified(true);

      alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);
    try {
      await signup({ nickname, email, password });
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-primary flex min-h-screen w-full flex-1 justify-center px-5 py-10">
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
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <InputField>
            <InputField.Label>닉네임</InputField.Label>
            <InputField.Input
              type="text"
              value={nickname}
              onChange={(e) => {
                const value = e.target.value;
                setNickname(value);
                nicknameRef.current = value;
                setNicknameError(getNicknameError(value));
                setIsNicknameValid(false);
              }}
            />
            <InputField.Button
              onClick={handleCheckNickname}
              disabled={!nickname || !!nicknameError || isCheckingNickname}
            >
              중복확인
            </InputField.Button>
            <InputField.Error>{nicknameError}</InputField.Error>
          </InputField>

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
            <InputField.Button
              onClick={handleCheckEmail}
              disabled={!email || !!emailError || isSendingCode}
            >
              이메일 인증
            </InputField.Button>
            <InputField.Error>{emailError}</InputField.Error>
          </InputField>

          {isCodeSent && !isEmailVerified ? (
            <InputField>
              <InputField.Label>인증코드</InputField.Label>
              <InputField.Input
                placeholder="인증코드 6자리"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <InputField.Button
                onClick={handleVerifyCode}
                disabled={!verificationCode}
              >
                인증코드 확인
              </InputField.Button>
              <InputField.Error>{verificationCodeError}</InputField.Error>
            </InputField>
          ) : null}

          <InputField>
            <InputField.Label>비밀번호</InputField.Label>
            <InputField.Password
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setPasswordError(getPasswordError(value));
              }}
            />
            <InputField.Error>{passwordError}</InputField.Error>
          </InputField>

          <InputField>
            <InputField.Label>비밀번호 확인</InputField.Label>
            <InputField.Password
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);
                setPasswordConfirmError(getPasswordError(value));
              }}
            />
            <InputField.Error>{passwordConfirmError}</InputField.Error>
          </InputField>

          <Button
            type="submit"
            size="md"
            variant="primary"
            className="w-full"
            isDisabled={
              !isNicknameValid ||
              !isEmailValid ||
              !isCodeValid ||
              password !== confirmPassword ||
              isSubmitting
            }
          >
            회원가입
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-white">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="text-primary mt-4 inline-block self-center text-sm font-bold hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
