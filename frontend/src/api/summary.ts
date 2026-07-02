/** 결산 API — 지난주 운동+식단 요약, 레벨 */
import { apiClient, unwrap } from './client';
import type { ApiResponse, UserLevel, WeeklyRecap } from '../types';

export const summaryApi = {
  weeklyRecap: () => unwrap(apiClient.get<ApiResponse<WeeklyRecap>>('/summary/weekly-recap')),
  level: () => unwrap(apiClient.get<ApiResponse<UserLevel>>('/summary/level')),
};
