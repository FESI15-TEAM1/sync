import { type TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { fieldStyle } from '@/components/Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  errorMessage?: string;
};

export default function Textarea({
  label,
  errorMessage,
  ...props
}: TextareaProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label className="ml-2 text-base font-bold text-white">{label}</label>
      ) : null}
      <textarea
        className={twMerge(`${fieldStyle} resize-none`, props.className)}
        {...props}
      />
      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
