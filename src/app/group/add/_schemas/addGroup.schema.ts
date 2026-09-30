import { z } from 'zod';

export const addGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(1, '그룹 이름을 입력해주세요.')
    .max(50, '그룹 이름은 50자 이하로 입력해주세요.'),

  groupDescription: z
    .string()
    .trim()
    .max(200, '그룹 소개는 200자 이하로 입력해주세요.'),
  isPublic: z.boolean(),

  selectedPlaylists: z
    .array(z.number())
    .min(1, '플레이리스트를 하나 이상 선택해주세요.'),
});

export type GroupFormValues = z.infer<typeof addGroupSchema>;