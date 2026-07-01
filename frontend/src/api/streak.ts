/** 스트릭 API — 설계서 4.6 */
import { apiClient, unwrap } from './client';
import type { ApiResponse, Streak } from '../types';

export const streakApi = {
  me: () => unwrap(apiClient.get<ApiResponse<Streak>>('/streak/me')),
  couple: () => unwrap(apiClient.get<ApiResponse<Streak>>('/streak/couple')),
  // 식단 스트릭
  mealMe: () => unwrap(apiClient.get<ApiResponse<Streak>>('/streak/meal/me')),
  mealCouple: () => unwrap(apiClient.get<ApiResponse<Streak>>('/streak/meal/couple')),
};
