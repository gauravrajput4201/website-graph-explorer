import { ApiResponse, type ApiResponse as IApiResponse } from "./apiResponse";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleException(error: unknown): IApiResponse {
  // Handle custom ApiError
  if (error instanceof ApiError) {
    console.error(`[ApiError] ${error.statusCode}: ${error.message}`, error.data);
    return ApiResponse(false, error.statusCode, error.data, error.message);
  }

  // Handle standard Error
  if (error instanceof Error) {
    console.error(`[Error] ${error.name}: ${error.message}`);
    return ApiResponse(false, 500, undefined, error.message);
  }

  // Handle unknown error
  console.error("[Unknown Error]", error);
  return ApiResponse(false, 500, undefined, "Internal server error");
}

export async function tryAsync<T>(
  fn: () => Promise<T>
): Promise<[T | null, IApiResponse | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, handleException(error)];
  }
}
