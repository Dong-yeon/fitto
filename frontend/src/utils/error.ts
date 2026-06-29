import axios from 'axios';
import type { ApiResponse } from '../types';

/** axios 에러에서 백엔드 ApiResponse.message 를 추출 (설계서 4.1) */
export function getErrorMessage(error: unknown, fallback = '문제가 발생했습니다. 다시 시도해주세요.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
