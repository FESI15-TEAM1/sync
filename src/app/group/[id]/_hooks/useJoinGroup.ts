import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { APIError } from '@/lib/http/error';
import { requestJoinGroup } from '@/services/group/group.api';

export function useJoinGroup(groupId: number) {
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(
    null,
  );

  const joinGroupMutation = useMutation({
    mutationFn: () => requestJoinGroup(groupId),
    onSuccess: () => {
      setJoinErrorMessage(null);
    },
    onError: (error) => {
      setJoinErrorMessage(
        error instanceof APIError
          ? error.message
          : '참여 요청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleJoinGroup = () => {
    if (joinGroupMutation.isPending) return;
    joinGroupMutation.mutate();
  };

  return {
    handleJoinGroup,
    isJoinPending: joinGroupMutation.isPending,
    isJoinSuccess: joinGroupMutation.isSuccess,
    joinErrorMessage,
  };
}
