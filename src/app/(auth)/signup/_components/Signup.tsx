'use client';

// react-hook-form과 Zod를 연결해주는 resolver
// form의 입력값을 Zod 스키마로 검사할 수 있게 해줌
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
// react-hook-form에서 사용할 기능들
// useForm: 폼 전체 관리
// useWatch: 특정 input의 값을 실시간으로 감시
import { useForm, useWatch } from 'react-hook-form';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
// 회원가입 폼 타입과 Zod 회원가입 검증 스키마
import { type SignupFormValues, signupSchema } from '@/lib/auth-validation';

// 닉네임 중복확인을 위한 커스텀 훅
import { useCheckNicknameMutation } from '../_hooks/useCheckNicknameMutation';
// 이메일 인증코드 확인을 위한 커스텀 훅
import { useConfirmEmailVerificationMutation } from '../_hooks/useConfirmEmailVerificationMutation';
// 이메일 인증코드 발송을 위한 커스텀 훅
import { useRequestEmailVerificationMutation } from '../_hooks/useRequestEmailVerificationMutation';
// 회원가입을 위한 커스텀 훅
import { useSignupMutation } from '../_hooks/useSignupMutation';

export default function Signup() {
  const {
    // register:
    // input을 react-hook-form에 등록해서 입력값과 연결
    register,

    // handleSubmit:
    // form이 제출되었을 때 유효성 검사를 먼저 실행한 뒤
    // 문제가 없으면 전달한 함수를 실행
    handleSubmit,
    // control:
    // useWatch 등 react-hook-form의 다른 기능에서 사용하는 객체
    control,
    // getValues:
    // 현재 form에 입력되어 있는 값을 가져옴
    getValues,
    // trigger:
    // 특정 input의 유효성 검사를 직접 실행
    trigger,
    // setError:
    // 특정 input에 직접 에러를 등록
    setError,
    // clearErrors:
    // 특정 input에 등록된 에러를 제거
    clearErrors,
    formState: {
      errors,
      // form이 제출되는 동안 true
      // 중복 제출을 방지할 때 사용
      isSubmitting,
      isValid,
    },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 닉네임 중복확인이 성공했는지 저장
  // true라면 사용 가능한 닉네임이라는 의미
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  // 사용자가 입력한 이메일 인증코드
  const [verificationCode, setVerificationCode] = useState('');
  // 이메일 인증코드 관련 에러 메시지
  const [verificationCodeError, setVerificationCodeError] = useState('');

  // 이메일 인증코드를 서버에 발송했는지 여부
  const [isCodeSent, setIsCodeSent] = useState(false);
  // 이메일 인증코드가 올바른지 여부
  const [isCodeValid, setIsCodeValid] = useState(false);
  // 이메일 인증 전체가 완료되었는지 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 닉네임 중복확인 API를 실행하는 커스텀 훅
  const {
    // 닉네임 중복확인 함수를 가져옴
    checkNicknameMutate,
    // 현재 닉네임 중복확인 요청 중인지 여부
    isCheckingNickname,
  } = useCheckNicknameMutation();

  // 이메일 인증코드 발송 API를 실행하는 커스텀 훅
  const {
    // 이메일 인증코드 발송 함수를 가져옴
    requestEmailVerificationMutate,
    // 이메일 인증코드를 발송하는 중인지 여부
    // true일 때 버튼을 비활성화해서 중복 요청을 막음
    isSendingCode,
  } = useRequestEmailVerificationMutation();

  // 이메일 인증코드 확인 API를 실행하는 커스텀 훅
  const { confirmEmailVerificationMutate } =
    useConfirmEmailVerificationMutation();

  // 회원가입 API를 실행하는 커스텀 훅
  const { signupMutate, isSigningUp } = useSignupMutation();

  const nickname = useWatch({ control, name: 'nickname' });
  // email input의 값을 실시간으로 감시
  const email = useWatch({ control, name: 'email' });

  const handleCheckNickname = async () => {
    if (isCheckingNickname) return;

    // nickname input만 validation 실행
    // Zod에서 닉네임 규칙을 검사
    const valid = await trigger('nickname');
    // 닉네임 validation에 실패했다면 API 요청하지 않고 종료
    if (!valid) return;

    // API 요청을 보내는 순간의 닉네임을 저장
    // 나중에 사용자가 닉네임을 변경했는지 확인하기 위해 사용
    const nicknameAtRequest = getValues('nickname');
    try {
      const { available } = await checkNicknameMutate(nicknameAtRequest);
      // API 응답을 기다리는 동안 사용자가 닉네임을 변경했다면
      // 이전 닉네임에 대한 응답은 무시
      if (getValues('nickname') !== nicknameAtRequest) return;

      //사용 가능한 닉네임이라면
      if (available) {
        //기존 nickname 에러 제거
        clearErrors('nickname');
        // 닉네임 사용 가능 상태로 변경
        setIsNicknameAvailable(true);
        // 사용자에게 결과를 알려줌
        alert('사용 가능한 닉네임입니다.');
      } else {
        setError('nickname', {
          type: 'manual',
          message: '이미 사용 중인 닉네임입니다.',
        });
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      if (getValues('nickname') !== nicknameAtRequest) return;
      setIsNicknameAvailable(false);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleCheckEmail = async () => {
    if (isSendingCode) return;

    const valid = await trigger('email');
    if (!valid) return;

    try {
      await requestEmailVerificationMutate(getValues('email'));

      setIsCodeSent(true);

      alert('인증 코드를 발송했습니다.');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      await confirmEmailVerificationMutate({
        email: getValues('email'),
        code: verificationCode,
      });

      setIsCodeValid(true);
      setIsEmailVerified(true);

      alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  // form이 제출됐을 때 실행되는 함수
  // handleSubmit이 먼저 Zod validation을 실행한 후
  // 문제가 없을 때 이 함수가 실행됨
  const onSubmit = handleSubmit(async (data) => {
    if (!isNicknameAvailable) {
      setError('nickname', {
        type: 'manual',
        message: '닉네임 중복확인을 해주세요',
      });
      return;
    }

    if (!isCodeValid) {
      setVerificationCodeError('이메일 인증을 완료해주세요');
      return;
    }

    try {
      // 서버에 회원가입 요청
      await signupMutate({
        nickname: data.nickname,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  });

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
        <form className="flex flex-col gap-1" onSubmit={onSubmit}>
          <InputField>
            <InputField.Label>닉네임</InputField.Label>
            <InputField.Input
              type="text"
              {...register('nickname', {
                onChange: () => setIsNicknameAvailable(false),
              })}
            />
            <InputField.Button
              onClick={handleCheckNickname}
              disabled={!nickname || !!errors.nickname || isCheckingNickname}
            >
              중복확인
            </InputField.Button>
            <InputField.Error>{errors.nickname?.message}</InputField.Error>
          </InputField>

          <InputField>
            <InputField.Label>이메일</InputField.Label>
            <InputField.Input type="email" {...register('email')} />
            <InputField.Button
              onClick={handleCheckEmail}
              disabled={!email || !!errors.email || isSendingCode}
            >
              이메일 인증
            </InputField.Button>
            <InputField.Error>{errors.email?.message}</InputField.Error>
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
            <InputField.Password {...register('password')} />
            <InputField.Error>{errors.password?.message}</InputField.Error>
          </InputField>

          <InputField>
            <InputField.Label>비밀번호 확인</InputField.Label>
            <InputField.Password {...register('confirmPassword')} />
            <InputField.Error>
              {errors.confirmPassword?.message}
            </InputField.Error>
          </InputField>

          <Button
            type="submit"
            size="md"
            variant="primary"
            className="w-full"
            isDisabled={
              // Zod validation을 통과하지 못했거나
              !isValid ||
              // 닉네임 중복확인을 하지 않았거나
              !isNicknameAvailable ||
              // 이메일 인증을 하지 않았거나
              !isCodeValid ||
              // 회원가입 API 요청 중이라면
              isSubmitting ||
              isSigningUp
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
