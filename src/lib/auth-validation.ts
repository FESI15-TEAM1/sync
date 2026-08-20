export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function getNicknameError(nickname: string): string {
  // 빈 값이면 에러를 표시하지 않음
  if (!nickname) {
    return '';
  }

  if (nickname.length < NICKNAME_MIN_LENGTH) {
    return '닉네임은 최소 2자 이상이어야 합니다.';
  }

  if (getByteLength(nickname) > NICKNAME_MAX_BYTE_LENGTH) {
    return '닉네임은 한글 기준 최대 10자까지 입력 가능합니다.';
  }

  return '';
}

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
