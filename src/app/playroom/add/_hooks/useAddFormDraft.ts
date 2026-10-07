'use client';

import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { PLAYROOM_ADD_DRAFT_STORAGE_KEY } from '@/constants/localStorage';
import {
  PLAYROOM_DESCRIPTION_MAX_LENGTH,
  PLAYROOM_TITLE_MAX_LENGTH,
} from '@/constants/playroom';
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/utils/localStorage';

import type { AddFormInput, AddFormValues } from '../_schemas/addForm.schema';

/** 임시 저장해두는 값은 폼 입력값 그대로입니다(검증 전이라 playlistId 는 비어 있을 수 있습니다). */
type AddFormDraft = AddFormInput;

/**
 * 저장소에 남아 있는 값은 이전 버전이거나 손으로 고쳐졌을 수 있어, 모양을 확인하고
 * 알아볼 수 없는 필드는 빈 값으로 돌려놓습니다. watch 가 주는 부분 값도 같은 함수로 다듬습니다.
 */
function parseDraft(stored: unknown): AddFormDraft | null {
  if (typeof stored !== 'object' || stored === null) return null;

  const { title, description, playlistId } = stored as Record<string, unknown>;

  return {
    // 길이 제한을 넘는 값이 들어와도 폼이 곧바로 에러를 띄우지 않도록 잘라서 되살립니다.
    title:
      typeof title === 'string'
        ? title.slice(0, PLAYROOM_TITLE_MAX_LENGTH)
        : '',
    description:
      typeof description === 'string'
        ? description.slice(0, PLAYROOM_DESCRIPTION_MAX_LENGTH)
        : '',
    playlistId: typeof playlistId === 'number' ? playlistId : null,
  };
}

/** 되살린 값 중 실제로 채워져 있는 칸. */
function filledFields({ title, description, playlistId }: AddFormDraft) {
  const fields: (keyof AddFormDraft)[] = [];
  if (title !== '') fields.push('title');
  if (description !== '') fields.push('description');
  if (playlistId !== null) fields.push('playlistId');

  return fields;
}

/** 저장할 내용이 남아 있는지. 전부 비어 있으면 굳이 저장하지 않습니다. */
function hasContent(draft: AddFormDraft) {
  return filledFields(draft).length > 0;
}

/**
 * 플레이룸 생성 폼을 작성하던 내용을 localStorage 에 임시 저장합니다.
 * 다시 들어왔을 때 저장분이 있으면 곧바로 덮지 않고, 이어서 쓸지 새로 쓸지 사용자가 고르게 합니다.
 * 브라우저에만 남는 값이라 다른 기기에서는 이어지지 않습니다.
 */
export function useAddFormDraft(
  form: UseFormReturn<AddFormInput, unknown, AddFormValues>,
) {
  const { reset, watch, trigger } = form;
  const [pendingDraft, setPendingDraft] = useState<AddFormDraft | null>(null);
  // 사용자가 고르기 전에 이펙트가 빈 초기값을 저장해 기존 임시 저장분을 덮어쓰는 것을 막습니다.
  const isDecidedRef = useRef(false);

  // 서버 렌더에는 localStorage 가 없어 하이드레이션 이후에 한 번 읽습니다.
  useEffect(() => {
    const draft = parseDraft(getStorageItem(PLAYROOM_ADD_DRAFT_STORAGE_KEY));

    if (!draft || !hasContent(draft)) {
      isDecidedRef.current = true;
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 직후 1회, 브라우저 저장소와 맞추는 용도.
    setPendingDraft(draft);
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      if (!isDecidedRef.current) return;

      const draft = parseDraft(values);
      if (!draft) return;

      if (hasContent(draft)) {
        setStorageItem(PLAYROOM_ADD_DRAFT_STORAGE_KEY, draft);
      } else {
        // 사용자가 직접 다 지운 경우라, 남겨두면 다음 방문에 빈 값을 되살리게 됩니다.
        removeStorageItem(PLAYROOM_ADD_DRAFT_STORAGE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  /** 임시 저장분을 폼에 얹습니다. */
  const restoreDraft = () => {
    if (!pendingDraft) return;

    // keepFieldsRef 가 없으면 reset 이 필드 등록 정보를 통째로 비우고, 다시 렌더될 때
    // ref 콜백이 새로 붙으면서 값을 채워 넣기를 기대합니다. React Compiler 가 켜져 있으면
    // register() 결과가 메모이즈돼 ref 가 다시 붙지 않아, 폼 값만 바뀌고 인풋은 빈 채로 남습니다.
    reset(pendingDraft, { keepFieldsRef: true });
    // reset 은 검증을 다시 돌리지 않아, 되살린 값만으로도 제출 버튼이 열리도록 직접 돌립니다.
    // 아직 비어 있는 칸까지 검사하면 곧바로 에러가 뜨므로, 채워진 칸만 검사합니다.
    void trigger(filledFields(pendingDraft));

    isDecidedRef.current = true;
    setPendingDraft(null);
  };

  /** 임시 저장분을 버리고 빈 폼으로 시작합니다. */
  const discardDraft = () => {
    removeStorageItem(PLAYROOM_ADD_DRAFT_STORAGE_KEY);

    isDecidedRef.current = true;
    setPendingDraft(null);
  };

  /** 생성에 성공했을 때처럼 임시 저장분이 더 필요 없어진 시점에 호출합니다. */
  const clearDraft = () => {
    removeStorageItem(PLAYROOM_ADD_DRAFT_STORAGE_KEY);
  };

  return {
    /** 고를 임시 저장분이 남아 있는지. 확인 모달의 열림 여부로 씁니다. */
    hasPendingDraft: pendingDraft !== null,
    restoreDraft,
    discardDraft,
    clearDraft,
  };
}
