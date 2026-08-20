import { cva } from 'class-variance-authority';
import { type ReactNode, type TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { fieldStyle } from '@/components/Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | ReactNode;
  errorMessage?: string;
  resizable?: boolean;
  maxResize?: string;
  minResize?: string;
};

export default function Textarea({
  label,
  errorMessage,
  resizable = false,
  maxResize,
  minResize,
  ...props
}: TextareaProps) {
  const textareaStyle = cva(
    `${fieldStyle} scrollbar-thumb-text-secondary scrollbar-track-transparent`,
    {
      variants: {
        resizable: {
          true: 'resize-y',
          false: 'resize-none',
        },
      },
    },
  );
  return (
    <div className="flex w-full flex-col gap-1">
      {typeof label === 'string' ? (
        <label className="text-text-primary mb-2 ml-2 text-base font-bold">
          {label}
        </label>
      ) : typeof label === 'object' ? (
        <>{label}</>
      ) : null}
      <textarea
        style={{
          minHeight: `${minResize && minResize}`,
          maxHeight: `${maxResize && maxResize}`,
        }}
        className={twMerge(textareaStyle({ resizable }), props.className)}
        {...props}
      />
      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
