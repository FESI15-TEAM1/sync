import { type ReactNode } from 'react';

type InputLabelProps = {
  children: ReactNode;
};

export default function InputLabel({ children }: InputLabelProps) {
  return (
    <label className="mb-2 ml-2 text-base font-bold text-white">
      {children}
    </label>
  );
}
