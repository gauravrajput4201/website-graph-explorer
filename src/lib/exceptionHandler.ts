import { ApiResponse, type IApiResponse } from "./apiResponse";

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

export function handleException(error: unknown): Response {
  if (error instanceof ApiError) {
    console.error(`[ApiError] ${error.statusCode}: ${error.message}`, error.data);
    return ApiResponse(false, error.statusCode, error.data, error.message);
  }

  if (error instanceof Error) {
    console.error(`[Error] ${error.name}: ${error.message}`);
    return ApiResponse(false, 500, undefined, error.message);
  }

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
    const res = handleException(error);
    const body: IApiResponse = await res.json();
    return [null, body];
  }
}
