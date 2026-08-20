// POST /uploads — 이미지 업로드 URL 발급
export type UploadUrlRequest = {
  domain: 'profile' | 'group' | 'playlist';
  contentType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
};

export type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
};
