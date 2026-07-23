export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function getEmailError(email: string): string {
  // 빈 값이면 에러를 표시하지 않음
  if (!email) {
    return '';
  }

  // 이메일 형식이 잘못된 경우
  if (!EMAIL_REGEX.test(email)) {
    return '올바른 이메일 형식이 아닙니다.';
  }

  return '';
}

export function getPasswordError(password: string): string {
  // 빈 값이면 에러를 표시하지 않음
  if (!password) {
    return '';
  }

  // 비밀번호 규칙이 맞지 않는 경우
  if (!PASSWORD_REGEX.test(password)) {
    return '8자 이상, 영문 대·소문자, 숫자, 특수문자를 포함해주세요.';
  }

  return '';
}
