import type { SessionUser } from '@/services/user/user.types';

export const User: SessionUser[] = [
  { id: 0, nickname: '게스트', image: null },
  { id: 1, nickname: '정우', image: 'https://picsum.photos/seed/user1/200/200' },
];

// 이 이메일로 회원가입을 시도하면 목업이 중복 가입(403) 응답을 내려준다.
export const EXISTING_USER_EMAIL = 'existing@test.com';

// 이메일 인증 코드 확인 단계에서 이 코드만 성공 처리된다.
export const TEST_VERIFICATION_CODE = '123456';
