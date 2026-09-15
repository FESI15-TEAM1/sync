import { z } from 'zod';

import {
  PLAYROOM_DESCRIPTION_MAX_LENGTH,
  PLAYROOM_TITLE_MAX_LENGTH,
} from '@/constants/playroom';

export const addFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(
      PLAYROOM_TITLE_MAX_LENGTH,
      `제목은 최대 ${PLAYROOM_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    ),
  description: z
    .string()
    .max(
      PLAYROOM_DESCRIPTION_MAX_LENGTH,
      `설명은 최대 ${PLAYROOM_DESCRIPTION_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    ),
  // 선택 전에는 null 이라, 입력은 nullable 로 받고 pipe 로 number 만 통과시킵니다.
  playlistId: z
    .number()
    .nullable()
    .pipe(z.number({ error: '공유할 플레이리스트를 선택해주세요.' })),
});

export type AddFormInput = z.input<typeof addFormSchema>;
export type AddFormValues = z.output<typeof addFormSchema>;
