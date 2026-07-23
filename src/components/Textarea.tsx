import { type ChangeEvent } from 'react';

import { fieldStyle } from '@/components/Input';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value: string;
  width?: number | string;
  height?: number | string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  errorMessage?: string;
};

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  width = 255,
  height = 100,
  errorMessage,
}: TextareaProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label className="ml-2 text-base font-bold text-white">{label}</label>
      ) : null}
      <textarea
        className={`${fieldStyle}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width, height }}
      />
      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
