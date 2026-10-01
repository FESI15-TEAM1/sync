import { useMutation } from '@tanstack/react-query';

import { confirmEmailVerification } from '@/services/auth/auth.api';

export function useConfirmEmailVerificationMutation() {
  const {
    mutateAsync: confirmEmailVerificationMutate,
    isPending: isVerifyingCode,
  } = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      confirmEmailVerification(email, code),
  });

  return { confirmEmailVerificationMutate, isVerifyingCode };
}
