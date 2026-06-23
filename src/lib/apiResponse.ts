export interface ApiResponse<T = any> {
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
): ApiResponse<T> {
  return {
    success,
    code,
    data: data || null,
    ...(message && { message }),
  };
}
