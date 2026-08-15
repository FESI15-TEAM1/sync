import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { login } from '@/services/auth/auth.api';
import type { LoginRequest } from '@/services/auth/auth.types';

export function useLoginMutation() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const { mutate: loginMutate, isPending: isSubmitting } = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (user) => {
      setUser(user);
      router.push('/');
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof APIError) {
        alert(error.message);
        return;
      }
      alert('로그인 요청 중 오류가 발생했습니다.');
    },
  });

  return { loginMutate, isSubmitting };
}
