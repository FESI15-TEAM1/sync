import { z } from 'zod';

export const addPlaylistSchema = z.object({
  title: z.string().trim().min(1, '플레이리스트 이름은 필수입니다.').max(100),
  description: z.string().max(500),
  image: z.string(),
  isPublic: z.boolean(),
  tracks: z.array(
    z.object({
      videoId: z.string(),
      title: z.string(),
      artist: z.string(),
      thumbnail: z.string(),
    }),
  ),
});

export type AddPlaylistFormValues = z.infer<typeof addPlaylistSchema>;
