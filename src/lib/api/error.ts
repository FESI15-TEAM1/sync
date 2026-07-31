export class APIError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);

    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}
