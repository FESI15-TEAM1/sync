'use client';

import type { Control } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import InputField from '@/components/InputField';

import type { AddPlaylistFormValues } from '../_schemas/addPlaylist.schema';

interface FieldErrorProps {
  control: Control<AddPlaylistFormValues>;
  name: keyof Omit<AddPlaylistFormValues, 'tracks'>;
}

export default function FieldError({ control, name }: FieldErrorProps) {
  const { errors } = useFormState({ control, name });

  return <InputField.Error>{errors[name]?.message}</InputField.Error>;
}
