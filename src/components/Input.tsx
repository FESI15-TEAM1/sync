'use client';

import { clsx } from 'clsx';
import { type ChangeEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  width?: number | string;
  height?: number | string;
  type?: 'text' | 'password' | 'email';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
  placeholder,
  value,
  onChange,
  width = 255,
  height = 44,
  type = 'text',
  errorMessage,
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
      {label ? (
        <label className="ml-2 text-base font-bold text-white">{label}</label>
      ) : null}
      <div className="relative" style={{ width, height }}>
        <input
          type={inputType}
          className={`${fieldStyle} h-full`}
          style={{ paddingRight: isPassword ? 44 : undefined }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="text-text-secondary hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.7 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-1.7 2.6" />
      <path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6" />
      <path d="M14.1 14.1a3 3 0 0 1-4.2-4.2" />
      <path d="m3 3 18 18" />
    </svg>
  );
}
