/** 스트릭 API — 설계서 4.6 */
import { apiClient, unwrap } from './client';
import type { ApiResponse, Streak } from '../types';

export const streakApi = {
  me: () => unwrap(apiClient.get<ApiResponse<Streak>>('/streak/me')),
  couple: () => unwrap(apiClient.get<ApiResponse<Streak>>('/streak/couple')),
};
