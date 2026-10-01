'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/Button';
import ConfirmModal from '@/components/domain/ConfirmModal';
import LiveHeartbeat from '@/components/domain/playroom/LiveHeartbeat';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import {
  PLAYROOM_DESCRIPTION_MAX_LENGTH,
  PLAYROOM_TITLE_MAX_LENGTH,
} from '@/constants/playroom';
import { hashTagToArray } from '@/utils/playroom/hashTag';

import { useAddFormDraft } from '../_hooks/useAddFormDraft';
import { usePostPlayroom } from '../_hooks/usePostPlayroom';
import {
  type AddFormInput,
  addFormSchema,
  type AddFormValues,
} from '../_schemas/addForm.schema';
import DescriptionHint from './DescriptionHint';
import PlaylistSelector from './PlaylistSelector';

export default function AddForm() {
  const router = useRouter();

  const form = useForm<AddFormInput, unknown, AddFormValues>({
    resolver: zodResolver(addFormSchema),
    mode: 'onChange',
    defaultValues: { title: '', description: '', playlistId: null },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // 작성 중이던 내용을 브라우저에 임시 저장해두고, 다시 들어오면 이어서 쓸지 물어봅니다.
  const { hasPendingDraft, restoreDraft, discardDraft, clearDraft } =
    useAddFormDraft(form);

  const { createPlayroom, isCreating, errorMessage, reset } = usePostPlayroom();

  const isSubmitDisabled = !isValid || isCreating;

  const onSubmit = ({ title, description, playlistId }: AddFormValues) => {
    if (isCreating) return;

    createPlayroom(
      {
        title,
        description,
        playlistId,
        hashtags: hashTagToArray(description),
      },
      // 방이 만들어졌으면 임시 저장분은 더 필요 없습니다.
      { onSuccess: clearDraft },
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* headline */}
      <h2 className="text-2xl font-bold text-white">플레이룸 시작하기</h2>

      {/* live type notice */}
      <div className="text-text-secondary py-2 text-left text-sm font-normal">
        <span className="text-text-primary inline-flex items-center gap-1 align-bottom">
          <LiveHeartbeat size="md" /> 라이브
        </span>
        가 시작됩니다!
        <br /> 내가 방장이 되어 나의 플레이리스트를 재생하고 다함께 청취할 수
        있습니다!
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* set playroom title */}
        <InputField>
          <InputField.Label>제목</InputField.Label>
          <InputField.Input
            placeholder="제목을 입력해주세요."
            maxLength={PLAYROOM_TITLE_MAX_LENGTH}
            aria-invalid={!!errors.title}
            {...register('title')}
          />
          <InputField.Error>{errors.title?.message}</InputField.Error>
        </InputField>

        {/* set playroom description */}
        <Textarea
          label={<DescriptionHint />}
          placeholder="설명을 입력해주세요. 플레이룸 설명은 목록에서만 나타납니다."
          maxLength={PLAYROOM_DESCRIPTION_MAX_LENGTH}
          errorMessage={errors.description?.message}
          resizable={true}
          minResize="66px"
          maxResize="100px"
          {...register('description')}
        />

        {/* pick playlist */}
        <h3 className="text-base font-bold text-white">
          공유 할 플레이리스트 선택
        </h3>

        {/* 카드 클릭으로 값을 정하는 커스텀 입력이라 register 대신 Controller 로 연결합니다. */}
        <Controller
          control={control}
          name="playlistId"
          render={({ field }) => (
            <PlaylistSelector
              selectedPlaylistId={field.value}
              onSelect={field.onChange}
            />
          )}
        />

        <p role="alert" className="min-h-5 text-sm text-red-500">
          {errors.playlistId?.message}
        </p>

        {/* buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button isDisabled={isSubmitDisabled} type="submit">
            {isCreating ? '생성 중...' : '생성하기'}
          </Button>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-text-secondary hover:text-text-primary cursor-pointer font-bold"
          >
            취소
          </button>
        </div>
      </form>

      {/* 임시 저장분 이어쓰기 안내. 둘 중 하나를 고르기 전까지는 닫히지 않습니다. */}
      <ConfirmModal
        isOpen={hasPendingDraft}
        title="작성 중이던 내용이 있습니다"
        description="이어서 작성하시겠습니까? 새로 작성하면 저장된 내용은 사라집니다."
        confirmLabel="이어서 작성"
        cancelLabel="새로 작성"
        closeOnBackdropClick={false}
        onConfirm={restoreDraft}
        onClose={discardDraft}
      />

      {/* 생성 실패 안내. 닫으면 mutation 을 reset 해 다시 제출할 수 있게 합니다. */}
      <ConfirmModal
        isOpen={!!errorMessage}
        title="오류"
        description={errorMessage}
        hasCancel={false}
        onConfirm={reset}
        onClose={reset}
      />
    </div>
  );
}
