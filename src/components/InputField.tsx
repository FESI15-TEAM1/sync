'use client';

import { type InputHTMLAttributes, type ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import EyeIcon from '@/assets/icons/eye.svg';
import EyeOffIcon from '@/assets/icons/eye-off.svg';

import Button from './Button';
import Input from './Input';
import InputLabel from './InputLabel';

type InputFieldProps = {
  children: ReactNode;
  className?: string;
};

// 전체 InputField
function InputField({ children, className }: InputFieldProps) {
  return (
    <div
      className={twMerge(
        'flex flex-wrap items-center gap-x-4 gap-y-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

// Password
function Password({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  // 비밀번호 보이기/숨기기 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="relative min-w-0 flex-1">
      <Input
        {...props}
        type={isPasswordVisible ? 'text' : 'password'}
        className={twMerge('pr-10', className)}
      />

      <button
        type="button"
        onClick={() => setIsPasswordVisible((prev) => !prev)}
        className="absolute top-1/2 right-3 -translate-y-1/2"
        aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        {isPasswordVisible ? (
          <EyeOffIcon
            className="text-white"
            width={20}
            height={20}
            aria-hidden
          />
        ) : (
          <EyeIcon className="text-white" width={20} height={20} aria-hidden />
        )}
      </button>
    </div>
  );
}

// Button
function InputFieldButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      isDisabled={disabled}
      className={twMerge('shrink-0', className, 'w-25 px-2')}
    >
      {children}
    </Button>
  );
}

// Error
function Error({ children }: { children?: ReactNode }) {
  return <p className="min-h-5 w-full text-sm text-red-500">{children}</p>;
}

// Compound Component 연결
InputField.Label = InputLabel;
InputField.Input = Input;
InputField.Password = Password;
InputField.Button = InputFieldButton;
InputField.Error = Error;

export default InputField;
