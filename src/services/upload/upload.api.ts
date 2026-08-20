import { clientFetch } from '@/lib/http/client-fetch';

import type { UploadUrlRequest, UploadUrlResponse } from './upload.types';

// 이미지 업로드 URL 발급
export function requestUploadUrl(data: UploadUrlRequest) {
  return clientFetch<UploadUrlResponse>('/uploads', {
    method: 'POST',
    body: data,
  });
}
