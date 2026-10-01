import { z } from 'zod';

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const NICKNAME_MIN_LENGTH = 2;
// 한글은 2바이트, 영문·숫자는 1바이트로 계산해 "한글 기준 최대 10자"에 해당하는 바이트 수
export const NICKNAME_MAX_BYTE_LENGTH = 20;

// 한글(등 비 ASCII 문자)은 2바이트, 영문·숫자·특수문자는 1바이트로 계산
function getByteLength(value: string): number {
  let byteLength = 0;
  for (const char of value) {
    byteLength += char.charCodeAt(0) > 127 ? 2 : 1;
  }
  return byteLength;
}

export const nicknameSchema = z
  .string()
  .min(1, '닉네임을 입력해주세요.')
  .min(NICKNAME_MIN_LENGTH, '닉네임은 최소 2자 이상이어야 합니다.')
  .refine((value) => getByteLength(value) <= NICKNAME_MAX_BYTE_LENGTH, {
    message: '닉네임은 한글 기준 최대 10자까지 입력 가능합니다.',
  });

export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식이 아닙니다.');

export const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해주세요.')
  .regex(
    PASSWORD_REGEX,
    '8자 이상, 영문 대·소문자, 숫자, 특수문자를 포함해주세요.',
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    nickname: nicknameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호를 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
