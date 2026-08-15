import { useMutation } from '@tanstack/react-query';

import { checkNickname } from '@/services/auth/auth.api';

export function useCheckNicknameMutation() {
  const { mutateAsync: checkNicknameMutate, isPending: isCheckingNickname } =
    useMutation({
      mutationFn: (nickname: string) => checkNickname(nickname),
    });

  return { checkNicknameMutate, isCheckingNickname };
}
