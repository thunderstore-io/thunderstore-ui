export function isApiError(e: Error | ApiError | unknown): e is ApiError {
  return e instanceof ApiError;
}

export class ApiError extends Error {
  constructor(message?: string) {
    super(message);
  }

  static createFromResponse(response: Response): ApiError {
    // TODO: Implement response parsing for known error scenarios
    return new ApiError(`${response.status}: ${response.statusText}`);
  }

  getFieldErrors(): { [key: string]: string[] } {
    // TODO: Implement
    return {};
  }
}
