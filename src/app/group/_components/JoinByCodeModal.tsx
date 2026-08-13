'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { APIError } from '@/lib/http/error';
import { getPublicGroups, joinGroupByCode } from '@/services/group/group.api';

// 그룹 목록 페이지에는 groupId가 없고, 코드만으로 그룹을 찾는 백엔드 엔드포인트도
// 없습니다. 대신 공개 그룹들을 돌면서 입력한 코드로 가입을 순서대로 시도해
// 일치하는 그룹을 찾습니다(비공개 그룹은 목록에 아예 노출되지 않아 이 방식으로는
// 찾을 수 없습니다).
const PUBLIC_GROUP_SEARCH_LIMIT = 50;

async function joinPublicGroupByCode(inviteCode: string) {
  const { items: groups } = await getPublicGroups({
    limit: PUBLIC_GROUP_SEARCH_LIMIT,
  });

  for (const group of groups) {
    try {
      await joinGroupByCode(group.id, { inviteCode });
      return group.id;
    } catch (error) {
      if (error instanceof APIError && error.code === 'INVALID_INVITE_CODE') {
        continue;
      }
      throw error;
    }
  }

  throw new APIError(
    400,
    'INVALID_INVITE_CODE',
    '초대코드가 올바르지 않습니다.',
  );
}

type JoinByCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JoinByCodeModal({
  isOpen,
  onClose,
}: JoinByCodeModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = () => {
    setCode('');
    setErrorMessage(null);
    onClose();
  };

  const { mutate: joinByCode, isPending } = useMutation({
    mutationFn: joinPublicGroupByCode,
    onSuccess: (groupId) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      handleClose();
      router.push(`/group/${groupId}`);
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof APIError
          ? error.message
          : '참여에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleSubmit = () => {
    if (!code || isPending) return;

    setErrorMessage(null);
    joinByCode(code);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabelledBy="join-by-code-title"
    >
      <Modal.Header ariaLabelledById="join-by-code-title">
        초대코드
      </Modal.Header>
      <Modal.Body>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          aria-label="초대코드"
          className="border-primary text-primary border-2 border-dashed bg-transparent py-3 text-center text-lg font-bold tracking-widest uppercase"
        />
        {errorMessage && (
          <p role="alert" className="mt-2 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="primary"
          size="lg"
          isDisabled={code.length === 0 || isPending}
          onClick={handleSubmit}
          className="w-full"
        >
          {isPending ? '참여하는 중...' : '참여하기'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
