export interface IApiResponse<T = any> {
  success: boolean;
  code: number;
  data: T | null;
  message?: string;
}

export function ApiResponse<T = any>(
  success: boolean,
  code: number,
  data?: T,
  message?: string
): Response {
  const body: IApiResponse<T> = {
    success,
    code,
    data: data ?? null,
    ...(message && { message }),
  };
  return Response.json(body, { status: code });
}
