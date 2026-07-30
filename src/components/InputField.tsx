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
        'flex flex-wrap items-center gap-x-2 gap-y-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

// Password
function Password({
  type = 'text',
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  // 비밀번호 보이기/숨기기 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

  return (
    <div className="relative">
      <Input
        {...props}
        type={isPasswordVisible ? 'text' : 'password'}
        className={className}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <EyeOffIcon width={20} height={20} aria-hidden />
          ) : (
            <EyeIcon width={20} height={20} aria-hidden />
          )}
        </button>
      )}
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
      className={twMerge('shrink-0', className)}
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
