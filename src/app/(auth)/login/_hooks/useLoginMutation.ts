import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { login } from '@/services/auth/auth.api';
import type { LoginRequest } from '@/services/auth/auth.types';

export function useLoginMutation() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const {
    mutate: loginMutate,
    isPending: isSubmitting,
  } = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (user) => {
      setUser(user);
      router.push('/');
    },
    onError: (error) => {
      if (error instanceof APIError) {
        console.error(error.message);
        alert(error.message);
      }
    },
  });

  return { loginMutate, isSubmitting };
}
