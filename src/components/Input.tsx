'use client';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  width?: number | string;
  height?: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
};

export default function Input ({
  label,
  placeholder,
  value,
  onChange,
  width = 255,
  height = 44,
  errorMessage,
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label ? <label className="text-base font-bold text-white ml-2">{label}</label> : null}
      <input
        type="text"
        className="w-full rounded-md border text-base border-border bg-bg-card px-3 py-2 text-white placeholder:text-text-secondary focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width, height}}
      />
      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};
