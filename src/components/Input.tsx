'use client';

import { type InputHTMLAttributes, useState } from 'react';

import EyeIcon from '@/assets/icons/eye.svg';
import EyeOffIcon from '@/assets/icons/eye-off.svg';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  width?: number | string;
  height?: number | string;
  errorMessage?: string;
};

export default function Input({
  label,
  width,
  height,
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

      <div
        className="relative"
        style={{
          width,
          height,
        }}
      >
        <input
          {...props}
          type={inputType}
          className={`border-border bg-bg-card placeholder:text-text-secondary h-full w-full rounded-md border px-3 py-2 text-base text-white focus:outline-none ${
            isPassword ? 'pr-11' : ''
          }`}
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

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
