export function isApiError(e: Error | ApiError | unknown): e is ApiError {
  return e instanceof ApiError;
}

export class ApiError extends Error {
  response: { [key: string]: string[] } | undefined;

  constructor(message?: string, response?: { [key: string]: string[] }) {
    super(message);
    this.response = response;
  }

  static async createFromResponse(response: Response): Promise<ApiError> {
    // TODO: Implement response parsing for known error scenarios
    return new ApiError(
      `${response.status}: ${response.statusText}`,
      await response.json()
    );
  }

  getFieldErrors(): { [key: string]: string[] } {
    return { ...this.response };
  }
}
