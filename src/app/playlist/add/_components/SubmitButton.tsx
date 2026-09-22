'use client';

import type { Control } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import Button from '@/components/Button';

import type { AddPlaylistFormValues } from '../_schemas/addPlaylist.schema';

interface SubmitButtonProps {
  control: Control<AddPlaylistFormValues>;
  isSubmitting: boolean;
}

export default function SubmitButton({
  control,
  isSubmitting,
}: SubmitButtonProps) {
  const { isValid } = useFormState({ control });

  return (
    <Button
      type="submit"
      className="w-full"
      isDisabled={isSubmitting || !isValid}
    >
      {isSubmitting ? '저장 중...' : '저장하기'}
    </Button>
  );
}
