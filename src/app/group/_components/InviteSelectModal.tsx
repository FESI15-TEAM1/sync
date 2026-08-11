'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useGroupsQuery } from '@/app/group/hooks/useGroupsQuery';
import Button from '@/components/Button';
import GroupListItem from '@/components/domain/group/GroupListItem';
import Modal from '@/components/Modal';

const GROUP_LIST_LIMIT = 50;

type InviteSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (groupId: number) => void;
};

export default function InviteSelectModal({
  isOpen,
  onClose,
  onSelect,
}: InviteSelectModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { data, isPending, isError } = useGroupsQuery({
    limit: GROUP_LIST_LIMIT,
  });
  const groups = data?.items ?? [];

  const handleConfirm = () => {
    if (selectedGroupId === null) return;

    onSelect?.(selectedGroupId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5">
        <Modal.Header>존재하는 그룹 선택하기</Modal.Header>
        <Modal.Body>
          {isPending && (
            <p className="text-text-secondary text-sm">
              그룹 목록을 불러오는 중입니다...
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500" role="alert">
              그룹 목록을 불러오지 못했습니다.
            </p>
          )}

          {!isPending && !isError && groups.length === 0 && (
            <p className="text-text-secondary text-sm">
              참여 중인 그룹이 없습니다.
            </p>
          )}

          {groups.length > 0 && (
            <ul className="flex flex-col gap-3">
              {groups.map((group) => {
                const isSelected = group.id === selectedGroupId;

                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedGroupId(group.id)}
                      className={`w-full rounded-2xl border-2 text-left transition-colors ${
                        isSelected ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <GroupListItem {...group} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full flex-col items-center gap-8">
            <Button
              variant="primary"
              size="lg"
              isDisabled={selectedGroupId === null}
              type="button"
              onClick={handleConfirm}
              className="w-full"
            >
              선택 및 초대하기
            </Button>
            <p className="text-text-secondary text-sm">
              원하는 그룹이 없으신가요?{' '}
              <Link href="/group/add" className="text-primary font-semibold">
                그룹 생성하기
              </Link>
            </p>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
