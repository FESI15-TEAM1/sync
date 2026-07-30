'use client';

import { clsx } from 'clsx';
import { type InputHTMLAttributes, type Ref, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import EyeIcon from '@/assets/icons/eye.svg';
import EyeOffIcon from '@/assets/icons/eye-off.svg';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errorMessage?: string;
};

// 인풋 스타일 공유 사용!
export const fieldStyle = twMerge(
  clsx(
    'border-border bg-bg-card placeholder:text-text-secondary w-full rounded-md border px-3 py-2 text-base text-white focus:outline-none',
  ),
);

export default function Input({
  label,
  type = 'text',
  errorMessage,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';

  const inputType = isPassword
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type;

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="ml-2 text-base font-bold text-white">{label}</label>
      )}

      <div className={twMerge('relative')}>
        <input
          {...props}
          type={inputType}
          className={twMerge(
            fieldStyle,
            isPassword && 'pr-11',
            props.className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="text-text-secondary hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            {isPasswordVisible ? (
              <EyeOffIcon width={20} height={20} aria-hidden />
            ) : (
              <EyeIcon width={20} height={20} aria-hidden />
            )}
          </button>
        )}
      </div>

      <p className="min-h-5 text-sm text-red-500">{errorMessage}</p>
    </div>
  );
}
