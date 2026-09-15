import { useMutation } from '@tanstack/react-query';

import { requestEmailVerification } from '@/services/auth/auth.api';

export function useRequestEmailVerificationMutation() {
  const {
    mutateAsync: requestEmailVerificationMutate,
    isPending: isSendingCode,
  } = useMutation({
    mutationFn: (email: string) => requestEmailVerification(email),
  });

  return { requestEmailVerificationMutate, isSendingCode };
}
