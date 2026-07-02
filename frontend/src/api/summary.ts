/** 결산 API — 지난주 운동+식단 요약 */
import { apiClient, unwrap } from './client';
import type { ApiResponse, WeeklyRecap } from '../types';

export const summaryApi = {
  weeklyRecap: () => unwrap(apiClient.get<ApiResponse<WeeklyRecap>>('/summary/weekly-recap')),
};
