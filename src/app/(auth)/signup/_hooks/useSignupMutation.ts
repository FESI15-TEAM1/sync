import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signup } from '@/services/auth/auth.api';
import type { SignupRequest } from '@/services/auth/auth.types';

export function useSignupMutation() {
  const router = useRouter();

  const { mutateAsync: signupMutate, isPending: isSigningUp } = useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onSuccess: () => {
      router.push('/login');
    },
  });

  return { signupMutate, isSigningUp };
}
