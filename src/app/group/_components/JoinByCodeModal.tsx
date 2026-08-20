'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { APIError } from '@/lib/http/error';
import { joinGroupByInviteCode } from '@/services/group/group.api';

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
    mutationFn: (inviteCode: string) => joinGroupByInviteCode({ inviteCode }),
    onSuccess: (group) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      handleClose();
      router.push(`/group/${group.id}`);
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
